import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

const useAppState = () => {
  const [locationSelect, setLocationSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    getSelectedLocation();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (locationSelect) {
        router.replace('/(tabs)/prayer');
      } else {
        router.replace('/(tabs)/locationSelect');
      }
    }
  }, [isLoading, locationSelect]);

  return { isLoading };
};

export default function index() {
  const { isLoading } = useAppState();

  return <>{isLoading ? <ActivityIndicator /> : null}</>;
}
