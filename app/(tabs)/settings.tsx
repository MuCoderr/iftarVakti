import { Switch, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function settings() {
  const deviceColorScheme = useColorScheme(); // Cihazın genel tema tercihini al
  const [isDarkModeEnabled, setisDarkModeEnabled] = useState(deviceColorScheme === 'dark'); // Default tema tercihi

  useEffect(() => {
    // AsyncStorage'den kaydedilmiş tema tercihini al
    const fetchThemePreference = async () => {
      try {
        const storedThemePreference = await AsyncStorage.getItem('darkModeEnabled');
        setisDarkModeEnabled(storedThemePreference === 'true');
      } catch (error) {
        console.error('Error fetching theme preference:', error);
      }
    };

    fetchThemePreference();
  }, []);

  const toggleSwitch = () => {
    setisDarkModeEnabled((previousState) => !previousState);
    AsyncStorage.setItem('darkModeEnabled', String(!isDarkModeEnabled)); // Koyu mod durumunu sakla
    console.warn(isDarkModeEnabled);
  };

  return (
    <View
      className={`flex-1 justify-center items-center p-16 ${isDarkModeEnabled ? 'bg-[#525252]' : 'bg-[#FFFFFF]'}`}>
      <View className="flex-row bg-[#EDEDED] w-full h-14 rounded-xl justify-between items-center pl-5">
        <Text className="font-semibold text-[textColor]">Koyu Mod</Text>
        <Switch
          trackColor={{ false: '#DDDDDD', true: '#171717' }}
          thumbColor={isDarkModeEnabled ? '#DA0037' : '#DA0037'}
          ios_backgroundColor="#444444"
          onValueChange={toggleSwitch}
          value={isDarkModeEnabled}
        />
      </View>
      <View className="flex-row bg-[#EDEDED] w-full h-14 rounded-xl justify-between items-center pl-5 mt-5">
        <Text className="font-semibold text-[textColor]">Uygulamayı Sıfırla</Text>
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.clear();
            router.navigate('/locationSelect');
          }}
          className="pr-5">
          <MaterialIcons name="restart-alt" size={27} color="#DA0037" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
