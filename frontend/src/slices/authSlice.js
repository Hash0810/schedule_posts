import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.text();
      return thunkAPI.rejectWithValue(error || 'Registration failed');
    }
    return await res.json();
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData, thunkAPI) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpData),
    });
    if (!res.ok) {
      const error = await res.text();
      return thunkAPI.rejectWithValue(error || 'OTP verification failed');
    }
    return await res.json();
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (userData, thunkAPI) => {
    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.text();
      return thunkAPI.rejectWithValue(error || 'Failed to resend OTP');
    }
    return await res.json();
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, thunkAPI) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.text();
      return thunkAPI.rejectWithValue(error || 'Login failed');
    }
    return await res.json();
  }
);

export const passkeyLogin = createAsyncThunk(
  'auth/passkeyLogin',
  async (userData, thunkAPI) => {
    const res = await fetch('/api/auth/passkey-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.text();
      return thunkAPI.rejectWithValue(error || 'Passkey login failed');
    }
    return await res.json();
  }
);

export const markPasskeyRegistered = createAsyncThunk(
  'auth/markPasskeyRegistered',
  async (userData, thunkAPI) => {
    const res = await fetch('/api/auth/mark-passkey-registered', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.text();
      return thunkAPI.rejectWithValue(error || 'Failed to mark passkey as registered');
    }
    return await res.json();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Passkey Login
      .addCase(passkeyLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(passkeyLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(passkeyLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Mark Passkey Registered
      .addCase(markPasskeyRegistered.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(markPasskeyRegistered.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(markPasskeyRegistered.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
