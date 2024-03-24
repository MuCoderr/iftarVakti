import { Switch, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function settings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View className="flex-1 justify-center items-center p-16">
      <View className="flex-row bg-[#EDEDED] w-full h-14 rounded-xl justify-between items-center pl-5">
        <Text className="font-semibold">Koyu Mod "YAKINDA"</Text>
        <Switch
          trackColor={{ false: '#DDDDDD', true: '#171717' }}
          thumbColor={isEnabled ? '#DA0037' : '#DA0037'}
          ios_backgroundColor="#444444"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View className="flex-row bg-[#EDEDED] w-full h-14 rounded-xl justify-between items-center pl-5 mt-5">
        <Text className="font-semibold">Uygulamayı Sıfırla</Text>
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
