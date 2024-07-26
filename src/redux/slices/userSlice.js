import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    mobile: '',
    photoUrl: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action) {
      state.name = action.payload.name,
      state.mobile = action.payload.mobile,
      state.email = action.payload.email,
      state.photoUrl = action.payload.photoUrl
      state.isActive = action.payload.isActive
    },
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
