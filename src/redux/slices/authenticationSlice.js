import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  runnerId: null,
  runner: null,
  isAuthenticated: false,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login(state, action) {
      state.runnerId = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.runnerId = null;
      state.isAuthenticated = false;
    },
    updateRunner(state, action) {
      state.runner = action.payload
    }
  },
});

export const { login, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;


