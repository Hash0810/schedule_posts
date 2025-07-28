import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        return thunkAPI.rejectWithValue(error || 'Failed to fetch analytics');
      }
      
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPlatformAnalytics = createAsyncThunk(
  'analytics/fetchPlatformAnalytics',
  async (platform, thunkAPI) => {
    try {
      const response = await fetch(`/api/analytics/platform/${platform}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        return thunkAPI.rejectWithValue(error || 'Failed to fetch platform analytics');
      }
      
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateEngagement = createAsyncThunk(
  'analytics/updateEngagement',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/analytics/update-engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        return thunkAPI.rejectWithValue(error || 'Failed to update engagement');
      }
      
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createSampleData = createAsyncThunk(
  'analytics/createSampleData',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/analytics/create-sample-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        return thunkAPI.rejectWithValue(error || 'Failed to create sample data');
      }
      
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    platformData: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    clearAnalytics: (state) => {
      state.data = null;
      state.platformData = {};
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Platform Analytics
      .addCase(fetchPlatformAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.platformData[action.payload.platform] = action.payload;
        state.error = null;
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Engagement
      .addCase(updateEngagement.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateEngagement.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateEngagement.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create Sample Data
      .addCase(createSampleData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSampleData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createSampleData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAnalytics, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 