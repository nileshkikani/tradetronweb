import { createContext, useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { decode } from 'jsonwebtoken';
import { useDispatch } from 'react-redux';
import axiosInstance from 'src/utils/axios';
import { API_ROUTER } from 'src/services/routes';
import { setAuth } from 'src/redux/reducers/authSlice';

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
  validateToken: () => Promise.resolve(false)
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const dispatchStore = useDispatch();

  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    try {
      const decoded = decode(token);
      if (!decoded.exp) return true;
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }, []);

  const getUserFromToken = useCallback((token) => {
    try {
      const decoded = decode(token);
      return {
        id: decoded.userId || decoded.sub,
        email: decoded.email,
        name: decoded.name
      };
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
          isAuthenticated: true,
          user
        }
      });
    }

    return true;
  }, [isTokenExpired, getUserFromToken, state.isAuthenticated]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && !isTokenExpired(accessToken)) {
          const user = getUserFromToken(accessToken);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else if (refreshToken) {
          // Access token is expired or missing, but we have a refresh token
          try {
            const response = await axiosInstance.post(API_ROUTER.REFRESH_TOKEN, {
              refresh: refreshToken
            });

            const { access } = response.data;
            localStorage.setItem('accessToken', access);

            const user = getUserFromToken(access);
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user
              }
            });
          } catch (err) {
            console.error('Refresh token failed during init:', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
          }
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initializeAuth();
  }, [isTokenExpired, getUserFromToken]);

  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post(API_ROUTER.LOG_IN,
        JSON.stringify({ email, password }), {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );

      const accessToken = data.tokens.access;
      const refreshToken = data.tokens.refresh;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

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
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, full_name, password) => {
    try {
      const { data } = await axiosInstance.post(API_ROUTER.REGISTER,
        JSON.stringify({ email, full_name, password }), {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );

      const accessToken = data.tokens.access;
      const refreshToken = data.tokens.refresh;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register,
        validateToken
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