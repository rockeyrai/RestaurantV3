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

// Configure axios defaults (you can keep this if you still need API calls for login/signup)
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
        return rejectWithValue(error.response.data?.message || 'Registration failed');
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        state.isAuthenticated = !!savedUser;
        state.user = savedUser || null;
      }
    },
    toggleLoginModal: (state) => {
      state.showLoginModal = !state.showLoginModal;
      state.isRegistering = false;
      state.error = null;
    },
    toggleAuthMode: (state) => {
      state.isRegistering = !state.isRegistering;
      state.error = null;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Optionally, clear user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    } 
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        console.log("SignUp pending, setting loading to true");
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
        console.log("Signin pending, setting loading to true");
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { user } = action.payload; // Extract user from API response
        state.isAuthenticated = true;
        state.loading = false;
        state.showLoginModal= false,
        state.user = {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
  },
});


export const { toggleLoginModal, toggleAuthMode, loadUserFromStorage, signOut } = authSlice.actions;
export default authSlice.reducer;
