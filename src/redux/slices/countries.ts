import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Country } from '../../../redux/types';

const initialState: {
  countries: Country[];
  selectedCountryId: number | null;
} = {
  countries: [],
  selectedCountryId: null,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setCountries(state: any, action: PayloadAction<Country[]>) {
      state.countries = action.payload;
    },
    setSelectedCountryId(state: any, action: PayloadAction<number | null>) {
      state.selectedCountryId = action.payload;
    },
  },
});

export const { setCountries, setSelectedCountryId } = countriesSlice.actions;

export default countriesSlice.reducer;
