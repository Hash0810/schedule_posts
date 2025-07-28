import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import postsReducer from './slices/postsSlice';
import apiKeyReducer from './slices/apiKeySlice';
import notificationReducer from './slices/notificationSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    posts: postsReducer,
    apiKeys: apiKeyReducer,
    notifications: notificationReducer,
    analytics: analyticsReducer,
  },
});
