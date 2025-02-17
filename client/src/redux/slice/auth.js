import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Using axios to call your API

const initialState = {
  isAuthenticated: false,
  user: null,
  showLoginModal: false,
  isRegistering: false,
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  '/register',
  async ({ email, password, username }) => {
    try {
      // Call your API to create user in MySQL
      console.log('working')
      const response = await axios.post(`${env.process.NEXT_PUBLIC_FRONTEND_API}register`, {
        email,
        password,
        username,
      });

      if (response.status !== 200) {
        throw new Error('Failed to sign up');
      }

      return response.data; // Assuming this contains user data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error during signup');
    }
  }
);

export const signIn = createAsyncThunk(
  '/login',
  async ({ email, password }) => {
    try {
      const response = await axios.post(`${env.process.NEXT_PUBLIC_FRONTEND_API}login`, { email, password });

      if (response.status !== 200) {
        throw new Error('Failed to sign in');
      }

      return response.data; // Assuming this contains user data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  try {
    const response = await axios.post('/api/auth/signout');
    if (response.status !== 200) {
      throw new Error('Failed to sign out');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error during signout');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleLoginModal: (state) => {
      state.showLoginModal = !state.showLoginModal;
      state.isRegistering = false;
      state.error = null;
    },
    toggleAuthMode: (state) => {
      state.isRegistering = !state.isRegistering;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.showLoginModal = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred during signup';
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.showLoginModal = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Invalid email or password';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { toggleLoginModal, toggleAuthMode } = authSlice.actions;
export default authSlice.reducer;
