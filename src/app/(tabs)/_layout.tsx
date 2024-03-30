import React from 'react';
import { Tabs } from 'expo-router';
import { store } from '../../redux/store';
import { Provider } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import '../../../global.css';

export default function _layout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#DA0037',
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
        }}>
        {/* <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            href: null,
          }}
        /> */}
        {/* <Tabs.Screen
          name="locationSelect"
          options={{
            title: 'LocationSelect',
            headerShown: false,
            tabBarStyle: { display: 'none' },
            href: null,
          }}
        /> */}
        <Tabs.Screen
          name="prayer"
          options={{
            title: 'Prayer',
            headerShown: false,
            tabBarIcon: ({ color }) => <MaterialIcons name="mosque" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
          }}
        />
      </Tabs>
    </Provider>
  );
}
