import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { lightColors, darkColors } from 'src/utils/colors';

export default function LocationItem() {
  const [cityName, setCityName] = useState<string | null>('');
  const [districtName, setDistrictName] = useState<string | null>('');

  const color = lightColors;

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
          <FontAwesome6 name="location-dot" size={24} color={color.primary} className="mr-2" />
          <Text className={`color-[${color.primary}] font-bold p-[3]`}>
            {cityName} / {districtName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
