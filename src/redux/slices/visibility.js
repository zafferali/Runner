import { createSlice } from '@reduxjs/toolkit';

export const visibilitySlice = createSlice({
  name: 'visibility',
  initialState: {
    tabBarVisible: true,
    searchBarVisible: true,
  },
  reducers: {
    setTabBarVisibility: (state, action) => {
      state.tabBarVisible = action.payload;
    },
    setSearchBarVisibility: (state, action) => {
      state.searchBarVisible = action.payload;
    },
  },
});

// Export the action creators
export const { setTabBarVisibility, setSearchBarVisibility } = visibilitySlice.actions;

// Export the reducer
export default visibilitySlice.reducer;
