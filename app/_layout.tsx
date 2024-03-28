import React from 'react';
import { Stack } from 'expo-router';
import { store } from '../src/redux/store';
import { Provider } from 'react-redux';
import '../global.css';

export default function _layout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
