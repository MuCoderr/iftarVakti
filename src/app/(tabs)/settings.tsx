import { Switch, Text, View, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

import { useDispatch, useSelector } from 'react-redux';
import { toggleRamadanMode } from '~/src/redux/slices/ramadanMode';

export default function settings() {
  const { toggleColorScheme, colorScheme } = useColorScheme();

  const dispatch = useDispatch();
  const { ramadanMode } = useSelector((state: any) => state.ramadanMode);

  const toggleThemeSwitch = async () => {
    try {
      await AsyncStorage.setItem('mode', colorScheme === 'light' ? 'dark' : 'light');
      toggleColorScheme();
    } catch (error) {
      console.error('Error saving mode:', error);
    }
  };

  const toogleRamadanModeSwitch = async () => {
    try {
      await AsyncStorage.setItem('ramadanMode', JSON.stringify(ramadanMode==true ? false : true));
      dispatch(toggleRamadanMode(ramadanMode==true ? false : true));

      // console.warn(ramadanMode);
    } catch (error) {
      console.error('Error saving mode:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-16 bg-light-background dark:bg-dark-background">
      <View className="flex-row bg-light-settingsItem dark:bg-dark-settingsItem w-full h-14 rounded-xl justify-between items-center pl-5">
        <Text className="font-semibold text-light-secondary dark:text-dark-secondary">
          Koyu Mod
        </Text>
        <Switch
          className="mr-3"
          trackColor={{ false: '#DDDDDD', true: '#171717' }}
          thumbColor={'#DA0037'}
          ios_backgroundColor="#444444"
          onValueChange={toggleThemeSwitch}
          value={colorScheme == 'light' ? false : true}
        />
      </View>
      <View className="flex-row bg-light-settingsItem dark:bg-dark-settingsItem w-full h-14 rounded-xl justify-between items-center pl-5 mt-5">
        <Text className="font-semibold text-light-secondary dark:text-dark-secondary">
          Ramazan Modu
        </Text>
        <Switch
          className="mr-3"
          trackColor={{ false: '#DDDDDD', true: '#171717' }}
          thumbColor={'#DA0037'}
          ios_backgroundColor="#444444"
          onValueChange={toogleRamadanModeSwitch}
          value={JSON.stringify(ramadanMode )== "true" ? true : false}
        />
      </View>
      <View className="flex-row bg-light-settingsItem dark:bg-dark-settingsItem w-full h-14 rounded-xl justify-between items-center pl-5 mt-5">
        <Text className="font-semibold text-light-secondary dark:text-dark-secondary">
          Uygulamayı Sıfırla

        </Text>
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.clear();
            router.navigate('/locationSelect');
          }}
          className="mr-6">
          <MaterialIcons name="restart-alt" size={27} color="#DA0037" />
        </TouchableOpacity>
      </View>
      <View className="flex-row bg-light-settingsItem dark:bg-dark-settingsItem w-full h-14 rounded-xl justify-between items-center px-10 mt-5">
        <TouchableOpacity
          onPress={() => Linking.openURL('https://github.com/MuCoderr')}>
          <FontAwesome6 name="github" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.instagram.com/myasinnd/')}>
          <FontAwesome6 name="instagram" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.youtube.com/@mucoderr')}>
          <FontAwesome6 name="youtube" size={26} color="white" />
        </TouchableOpacity>
      </View>

      
    <View className="absolute bottom-10 w-full h-14 rounded-xl  items-center px-10 mt-5">
      <Text className="font-semibold text-light-settingsItemTwo dark:text-dark-settingsItemTwo">
        Mücahit Yasin Daşdemir
      </Text>
      <Text className="font-semibold text-light-settingsItemTwo dark:text-dark-settingsItemTwo">
        Version {require('../../../package.json').version}
      </Text>
    </View>
    </View>
    
  );
}
