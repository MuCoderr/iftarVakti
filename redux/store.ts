import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './slices/countries';
import citiesReducer from './slices/cities';
import districtsReducer from './slices/districts';
import prayerTimesReducer from './slices/prayerTimes';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    cities: citiesReducer,
    districts: districtsReducer,
    prayerTimes: prayerTimesReducer,
  },
});

export default store;
