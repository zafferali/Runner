// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import visibilityReducer from './slices/visibilitySlice';
import availabilityReducer from './slices/availabilitySlice';
import authenticationReducer from './slices/authenticationSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    visibility: visibilityReducer,
    availability: availabilityReducer,
    authentication: authenticationReducer,
    ui: uiReducer,
    user: userReducer,
  },
});
