import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { toggleRamadanMode } from '~/src/redux/slices/ramadanMode';

const useAppState = () => {
  const [locationSelect, setLocationSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSelectedLocation = async () => {
      try {
        const selectedLocation = await AsyncStorage.getItem('selectedLocation');
        setLocationSelect(selectedLocation === 'true');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadRamadanMode = async () => {
      try {
        const savedRamadanMode = await AsyncStorage.getItem('ramadanMode');
        if (savedRamadanMode !== null) {
          dispatch(toggleRamadanMode(JSON.parse(savedRamadanMode)));
        }
      } catch (error) {
        console.error('Error loading ramadan mode:', error);
      }
    };

    getSelectedLocation();
    loadRamadanMode();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (locationSelect) {
        router.replace('/(tabs)/prayer');
      } else {
        router.replace('/locationSelect');
      }
    }
  }, [isLoading, locationSelect]);

  return { isLoading };
};

export default function index() {
  const { isLoading } = useAppState();

  return <>{isLoading ? <ActivityIndicator /> : null}</>;
}
