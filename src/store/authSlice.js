import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authState: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4NDgyNjQ3LCJpYXQiOjE3MjgzOTYyNDcsImp0aSI6IjViMzc0ZmUyNjhiOTQzMDJiN2QwZmU1M2M4Njk3YmViIiwidXNlcl9pZCI6MTF9.aO40G8Vw3ZvHxEcRA8dKhi3eyGYkQIf7fF4pAJbArRk",
  isUser:false,
  // isCookie:false,
  // rememberMe:false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.authState = action.payload;
    },
    setUserStatus: (state, action) => {
      state.isUser = action.payload;
    },
    // setUserStatusInitially: (state, action) => {
    //   state.isCookie = action.payload;
    // },
    // setRememberMe: (state, action) => {
    //   state.rememberMe = action.payload;
    // },
  },
});

export const { setAuth,setUserStatus } = authSlice.actions;
export const authReducer = authSlice.reducer;
