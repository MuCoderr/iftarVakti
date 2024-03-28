import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrayerTimes } from '../../../redux/types';

const initialState: {
  prayerTimes: PrayerTimes[];
} = {
  prayerTimes: [],
};

const prayerTimesSlice = createSlice({
  name: 'prayerTimes',
  initialState,
  reducers: {
    setPrayerTimes(state: any, action: PayloadAction<PrayerTimes[]>) {
      state.prayerTimes = action.payload;
    },
  },
});

export const { setPrayerTimes } = prayerTimesSlice.actions;

export default prayerTimesSlice.reducer;
