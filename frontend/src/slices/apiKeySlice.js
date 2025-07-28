import { createSlice } from '@reduxjs/toolkit';

const apiKeySlice = createSlice({
  name: 'apiKeys',
  initialState: {
    keys: [],
  },
  reducers: {
    addApiKey(state, action) {
      state.keys.push(action.payload);
    },
    removeApiKey(state, action) {
      state.keys = state.keys.filter(key => key.id !== action.payload);
    },
    updateApiKey(state, action) {
      const idx = state.keys.findIndex(key => key.id === action.payload.id);
      if (idx !== -1) state.keys[idx] = action.payload;
    },
  },
});

export const { addApiKey, removeApiKey, updateApiKey } = apiKeySlice.actions;
export default apiKeySlice.reducer;
