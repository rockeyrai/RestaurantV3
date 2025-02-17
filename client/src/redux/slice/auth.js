import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    showLoginModal: false,
  },
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      state.showLoginModal = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    toggleLoginModal: (state) => {
      state.showLoginModal = !state.showLoginModal;
    },
  },
});

export const { login, logout, toggleLoginModal } = authSlice.actions;
export default authSlice.reducer;