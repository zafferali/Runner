import { createSlice } from '@reduxjs/toolkit';

export const availabilitySlice = createSlice({
  name: 'availability',
  initialState: {
    available: false,
  },
  reducers: {
    toggleAvailability: state => {
      state.available = !state.available;
    },
  },
});

// Actions
export const { toggleAvailability } = availabilitySlice.actions;

// Selectors
export const selectIsAvailable = (state) => state.availability.available;

// Reducer
export default availabilitySlice.reducer;
