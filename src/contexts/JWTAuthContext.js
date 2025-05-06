import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// import { decode } from '../utils/jwt';
import { useDispatch } from 'react-redux';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { setAuth } from 'src/redux/reducers/authSlice';
import { useRouter } from 'next/router'

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const dispatchStore = useDispatch();
  const router = useRouter();

  const users = []; 

  const getUserFromToken = useCallback((token) => {
    try {
      const { userId } = decode(token);
      return users.find(user => user.id === userId); 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, []);

  const validateToken = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return false;
    
    if (isTokenExpired(accessToken)) {
      localStorage.removeItem('accessToken');
      dispatch({ type: 'LOGOUT' });
      return false;
    }
    
    if (!state.isAuthenticated) {
      const user = getUserFromToken(accessToken);
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated,
          user
        }
      });
    } else {
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post(API_ROUTER.LOG_IN,
        JSON.stringify({ email, password }), {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log('daraa',data)
      // console.log('axios',axiosInstance)
      const accessToken = data.tokens.access;
      localStorage.setItem('accessToken', accessToken); 
      
      const user = getUserFromToken(accessToken);
      // console.log(user);
      dispatchStore(setAuth(accessToken));
      dispatch({
        type: 'LOGIN',
        payload: { user }
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('time');
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, full_name, password) => {
    try {
      const { data } = await axiosInstance.post(API_ROUTER.REGISTER,
        JSON.stringify({ email, full_name, password }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const accessToken = data.tokens.access;
      localStorage.setItem('accessToken', accessToken);

      const newUser = {
        id: new Date().getTime().toString(),
        email,
        full_name,

      };

      users.push(newUser); 

      const user = getUserFromToken(accessToken);
      dispatch({
        type: 'REGISTER',
        payload: { user }
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleResponceError = () => {
    localStorage.removeItem('accessToken');
    logout();
    dispatch({
      type: 'LOGOUT'
    });
    router.push('/');
  };

  const refreshToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await axiosInstance.post(
        API_ROUTER.REFRESH_TOKEN,
        { refresh: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const newAccessToken = response.data.access;
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('time', Date.now().toString());
      }
    } catch (error) {
      console.error("Error refreshing token", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;