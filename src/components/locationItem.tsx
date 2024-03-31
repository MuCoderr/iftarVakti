import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

export default function LocationItem() {
  const [cityName, setCityName] = useState<string | null>('');
  const [districtName, setDistrictName] = useState<string | null>('');

  useEffect(() => {
    const getCityNameAndDistrictNameFromAsyncStorage = async () => {
      const cityName = await AsyncStorage.getItem('cityName');
      const districtName = await AsyncStorage.getItem('districtName');

      setCityName(cityName);
      setDistrictName(districtName);
    };
    getCityNameAndDistrictNameFromAsyncStorage();
  }, []);

  return (
    <View className="flex-none  p-[10] rounded-full m-10 ">
      <TouchableOpacity
        onPress={() => {
          AsyncStorage.clear();
          router.navigate('/locationSelect');
        }}>
        <View className="flex-row items-center">
          <FontAwesome6 name="location-dot" size={24} color="#DA0037" className="mr-2" />
          <Text className={`color-light-primary dark:color-dark-primary font-bold p-[3]`}>
            {cityName} / {districtName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
