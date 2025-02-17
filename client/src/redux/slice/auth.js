import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  showLoginModal: false,
  isRegistering: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.showLoginModal = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    toggleLoginModal: (state) => {
      state.showLoginModal = !state.showLoginModal;
      state.isRegistering = false;
    },
    toggleAuthMode: (state) => {
      state.isRegistering = !state.isRegistering;
    },
  },
});

export const { login, logout, toggleLoginModal, toggleAuthMode } = authSlice.actions;
export default authSlice.reducer;
