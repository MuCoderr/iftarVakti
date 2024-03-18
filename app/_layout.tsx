import React from 'react';
import { Stack } from 'expo-router';
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import '../global.css';

export default function _layout() {
  return (
    <Provider store={store}>
      <Stack />
    </Provider>
  );
}
