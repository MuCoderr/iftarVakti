import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { District } from '../types';

const initialState: {
  districts: District[];
  selectedDistrictsId: number | string | null;
} = {
  districts: [],
  selectedDistrictsId: null,
};

const districtsSlice = createSlice({
  name: 'districts',
  initialState,
  reducers: {
    setDistricts(state: any, action: PayloadAction<District[]>) {
      state.districts = action.payload;
    },
    setSelectedDistrictsId(state: any, action: PayloadAction<number | string | null>) {
      state.selectedDistrictsId = action.payload;
    },
  },
});

export const { setDistricts, setSelectedDistrictsId } = districtsSlice.actions;

export default districtsSlice.reducer;
