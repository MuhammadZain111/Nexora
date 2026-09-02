import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isCheckingAuth: true,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setCheckingAuth(state, action) {
      state.isCheckingAuth = action.payload;
    },
    logoutUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, setCheckingAuth, logoutUser } = authSlice.actions;
export default authSlice.reducer;
