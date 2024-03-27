// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import visibility from './slices/visibility';
import availability from './slices/availability';

export const store = configureStore({
  reducer: {
    visibility,
    availability,
  },
});
