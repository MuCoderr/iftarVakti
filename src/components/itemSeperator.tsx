import { View } from 'react-native';
import React from 'react';

export default function ItemSeperator() {
  return (
    <View className="w-full px-4 my-2">
      <View className="h-0.5 bg-light-gray dark:bg-dark-gray" />
    </View>
  );
}
