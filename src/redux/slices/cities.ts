import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City } from '../types';

const initialState: {
  cities: City[];
  selectedCityId: number | null;
} = {
  cities: [],
  selectedCityId: null,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCities(state: any, action: PayloadAction<City[]>) {
      state.cities = action.payload;
    },
    setSelectedCityId(state: any, action: PayloadAction<number | null>) {
      state.selectedCityId = action.payload;
    },
  },
});

export const { setCities, setSelectedCityId } = citiesSlice.actions;

export default citiesSlice.reducer;
