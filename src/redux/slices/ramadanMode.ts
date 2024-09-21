import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  ramadanMode:boolean ;
} = {
  ramadanMode: false,
};

const ramadanModeSlice = createSlice({
  name: 'ramadanMode',
  initialState,
  reducers: {
    toggleRamadanMode: (state, action: PayloadAction<boolean>) => {
      state.ramadanMode = action.payload;
      return state;

    },
  },
});

export const { toggleRamadanMode } = ramadanModeSlice.actions;

export default ramadanModeSlice.reducer;
