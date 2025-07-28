import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching notification preferences
export const fetchNotificationPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating notification preferences
export const updateNotificationPreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async (preferences, thunkAPI) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for marking notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, thunkAPI) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return notificationId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      postPublishedNotifications: true,
      postFailedNotifications: true,
      scheduleReminderNotifications: true,
      systemAlertNotifications: true,
      connectionIssueNotifications: true,
    },
    notifications: [],
    unreadCount: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    setEmail: (state, action) => {
      state.preferences.emailNotifications = action.payload;
    },
    setPush: (state, action) => {
      state.preferences.pushNotifications = action.payload;
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch preferences
      .addCase(fetchNotificationPreferences.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotificationPreferences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preferences = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationPreferences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
        state.error = null;
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch notifications
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => n.status === 'UNREAD').length;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.status = 'READ';
          notification.readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { setEmail, setPush, clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
