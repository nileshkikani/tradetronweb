'use client'
import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
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
  register: () => Promise.resolve(),
  handleResponceError: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const dispatchStore = useDispatch();
  const router = useRouter();

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

      // check if the login time is 23 hours ago or more
      const loginTime = localStorage.getItem('time');
      const currentTime = Date.now();
      const timeDiff = currentTime - loginTime;

      // if more than or equal to 23 hours (in milliseconds), refresh the token
      if (timeDiff >= 23 * 60 * 60 * 1000) {
        refreshToken();
      }

    } else {
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }

    // start refreshing the token every 10 seconds after authentication
    // const intervalId = setInterval(() => {
      // refreshToken();
    // },  23 * 60 * 60 * 1000); // 23 hours in milliseconds

    // Cleanup the interval on component unmount
    // return () => clearInterval(intervalId);

  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post(API_ROUTER.LOG_IN,
        JSON.stringify({ email, password }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const accessToken = data.tokens.access;
      const refreshToken = data.tokens.refresh;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('time', Date.now().toString());

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
    } catch (error) {
      console.error('Registration error:', error);
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
        register,
        handleResponceError
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
