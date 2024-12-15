import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPrayerTime: [],
};

const selectedPrayerTimeSlice = createSlice({
  name: 'prayerTime',
  initialState,
  reducers: {
    setSelectedPrayerTime: (state, action) => {
      state.selectedPrayerTime = action.payload;
    },
  },
});

export const { setSelectedPrayerTime } = selectedPrayerTimeSlice.actions;
export default selectedPrayerTimeSlice.reducer;