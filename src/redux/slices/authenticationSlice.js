import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  runnerId: null,
  runner: null,
  isAuthenticated: false,
  loading: true,
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
      state.runner = action.payload;
    },
    setAuthenticated(state, action) {
      state.runnerId = action.payload.runnerId;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = false
    },
  },
});

export const { login, logout, setAuthenticated } = authenticationSlice.actions;

export default authenticationSlice.reducer;
