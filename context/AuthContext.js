'use client';
// import React, { createContext } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useAppSelector } from 'react-redux';
// import { setAuth, setUserStatus  } from '@/store/authSlice';
// import { useAppSelector } from '@/store';
// import Cookie from 'js-cookie';
// import toast from 'react-hot-toast';
// import { API_ROUTER } from '@/services/routes';
// import axiosInstance from '@/utils/axios';


// export const AuthContext = createContext({});

// const initialState = {
//   data: []
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_DATA':
//       return {
//         ...state,
//         data: action.payload.data
//       };
//     default:
//       return state;
//   }
// };

// export const AuthProvider = ({ children }) => {
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const router = useRouter();
  // const storeDispatch = useDispatch();
  // const { data } = state;
  // const isUser = useAppSelector((state) => state.auth.isUser);
  // const checkIsRemember = useAppSelector((state) => state.auth.rememberMe);


  // const checkIsRemember = useAppSelector((state) => state.auth.rememberMe);

  // ----------------------LOGIN API CALL--------------------
  // const loginApiCall = async ({ email, password }) => {
  //   try {
  //     const response = await axiosInstance.post(API_ROUTER.LOG_IN, {
  //       email: email,
  //       password: password
  //     });
      // dispatch({
      //   type: 'SET_DATA',
      //   payload: response.data
      // });
      // storeDispatch(
      //   setAuth({
      //     access: response.data?.tokens?.access ? response.data?.tokens?.access : '',
      //     refresh: response.data?.tokens?.refresh ? response.data?.tokens?.refresh : ''
      //   })
      // );
      // storeDispatch(setUserStatus(true));
      // storeDispatch(setUserStatusInitially(true));
      // router.push('/option-wizard');
  //   } catch (error) {
  //     router.push('/login');
  //     toast.error("Wrong email or password");
      
  //   }
  // };

  // const checkTimer = () => {
  //   const currentTime = Date.now();
  //   const loginTime = Cookie.get('time');
  //   const elapsed = currentTime - parseInt(loginTime, 10);
  //   if (elapsed >= 12 * 60 * 60 * 1000) {
  //     if(checkIsRemember) 
  //       {
  //          refreshToken()
  //          return 
  //         }
  //     Cookie.remove('time');
  //     storeDispatch(setUserStatus(false));
  //     router.push('/login');
  //   }
  // };

  // const handleResponceError =()=>{
  //   Cookie.remove('access');
  //     Cookie.remove('refresh');
  //     storeDispatch(setUserStatus(false));
  //     Cookie.remove('time');
  //     storeDispatch(setUserStatusInitially(false));
  //     storeDispatch(setRememberMe(false));
  //     router.push('/login');
  // }
  // -----------GET NEW REFRESH TOKEN AND STORING------------
  // const refreshToken = async () => {
  //   const accessToken = Cookie.get('access');
  //   const refreshToken = Cookie.get('refresh');
  //   try {
  //     const newRefreshToken = await axiosInstance.post(
  //       API_ROUTER.REFRESH_TOKEN,
  //       { refresh: refreshToken },
  //       { headers: { Authorization: `Bearer ${accessToken}` } }
  //     );
  //     Cookie.set('access', newRefreshToken?.data?.tokens?.access);
  //     Cookie.set('time', Date.now().toString());
  //     storeDispatch(
  //       setAuth({
  //         ...authState,
  //         access: newRefreshToken?.data?.tokens?.access ? newRefreshToken?.data?.tokens?.access : ''
  //       })
  //     );
  //   } catch (error) {
  //     console.log("error") 
  //      }
  // };

//   return (
//     <AuthContext.Provider value={{ ...state, data, loginApiCall, refreshToken, checkTimer,handleResponceError }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
