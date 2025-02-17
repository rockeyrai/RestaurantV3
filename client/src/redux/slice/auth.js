import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  user: null,
  showLoginModal: false,
  isRegistering: false,
  loading: false,
  error: null,
};

// Configure axios defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUp = createAsyncThunk(
  'auth/register',
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await api.post('/register', {
        email,
        password,
        username,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return rejectWithValue(error.response.data?.message || 'Registration failed');
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue('No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        return rejectWithValue('Error setting up the request');
      }
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Invalid credentials');
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue('Error setting up the request');
      }
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/signout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error during signout');
    }
  }
);

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
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
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
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload || 'Signout failed';
      });
  },
});

export const { toggleLoginModal, toggleAuthMode } = authSlice.actions;
export default authSlice.reducer;