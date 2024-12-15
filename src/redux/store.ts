import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './slices/countries';
import citiesReducer from './slices/cities';
import districtsReducer from './slices/districts';
import prayerTimesReducer from './slices/prayerTimes';
import ramadanModeReducer from './slices/ramadanMode';
import selectedPrayerTimeReducer from './slices/selectedPrayerTimesItem';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    cities: citiesReducer,
    districts: districtsReducer,
    prayerTimes: prayerTimesReducer,
    ramadanMode: ramadanModeReducer,
    selectedPrayerTime: selectedPrayerTimeReducer,
  },
});

export default store;
