import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import LocationSelect from './locationSelect';
import Prayer from './prayer';

export default function index() {
  const [locationSelect, setLocationSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSelectedLocation = async () => {
      try {
        const selectedLocation: any = await AsyncStorage.getItem(`selectedLocation`);
        setLocationSelect(selectedLocation);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getSelectedLocation();
  }, []);

  return (
    <>
      {isLoading ? <ActivityIndicator /> : <>{locationSelect ? <Prayer /> : <LocationSelect />}</>}
    </>
  );
}
