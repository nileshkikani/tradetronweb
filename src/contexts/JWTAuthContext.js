import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { decode } from '../utils/jwt';
import { useDispatch } from 'react-redux';
import { setAuth } from 'src/store/authSlice';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';

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

  const users = []; 

  const getUserFromToken = (token) => {
    try {
      const { userId } = decode(token);
      return users.find(user => user.id === userId); 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken');
    const isAuthenticated = !!accessToken;

    if (isAuthenticated) {
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
      const { data } = await axiosInstance.post(API_ROUTER.LOG_IN ,
        JSON.stringify({ email, password }), {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const accessToken = data.tokens.access;
      localStorage.setItem('accessToken', accessToken); 
      
      const user = getUserFromToken(accessToken);
      dispatchStore(setAuth(accessToken));
      dispatch({
        type: 'LOGIN',
        payload: { user }
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, password) => {
    try {
      const { data } = await axiosInstance.post(API_ROUTER.REGISTER, 
        JSON.stringify({ email, name, password }), {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const accessToken = data.tokens.access; 
      localStorage.setItem('accessToken', accessToken);

      const newUser = {
        id: new Date().getTime().toString(),
        email,
        name,

      };

      users.push(newUser); 

      const user = getUserFromToken(accessToken);
      dispatch({
        type: 'REGISTER',
        payload: { user }
      });
    } catch (error) {
      console.error('Registration error:', error);
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
