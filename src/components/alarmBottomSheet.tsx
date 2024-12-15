import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Button } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemSeperator from './itemSeperator';
import { requestNotificationPermissions, schedulePrayerNotification, cancelPrayerNotifications } from '../utils/notifications';

const AlarmBottomSheet = forwardRef(({ dismiss, todayPrayerTimes }: any, ref: any) => {
  const snapPoints = useMemo(() => ['25%'], []);
  const { selectedPrayerTime } = useSelector((state: any) => state.selectedPrayerTime);
  const { colorScheme } = useColorScheme();

  const [timeOffsets, setTimeOffsets] = useState<{ [key: string]: number }>({});
  const [vaktindeSwitches, setVaktindeSwitches] = useState<{ [key: string]: boolean }>({});
  const [dkOnceSwitches, setDkOnceSwitches] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    (async () => {
      try {
        const [storedOffsets, storedVaktindeSwitches, storedDkOnceSwitches] = await Promise.all([
          AsyncStorage.getItem('timeOffsets'),
          AsyncStorage.getItem('vaktindeSwitches'),
          AsyncStorage.getItem('dkOnceSwitches'),
        ]);

        if (storedOffsets) setTimeOffsets(JSON.parse(storedOffsets));
        if (storedVaktindeSwitches) setVaktindeSwitches(JSON.parse(storedVaktindeSwitches));
        if (storedDkOnceSwitches) setDkOnceSwitches(JSON.parse(storedDkOnceSwitches));
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    })();
  }, []);

  const saveToStorage = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key}`, error);
    }
  };

  const updateTimeOffset = (increment: boolean) => {
    const currentOffset = timeOffsets[selectedPrayerTime.vakit] || 0;
    const newOffset = increment ? currentOffset + 5 : Math.max(currentOffset - 5, 0);
    const newOffsets = { ...timeOffsets, [selectedPrayerTime.vakit]: newOffset };
    setTimeOffsets(newOffsets);
    saveToStorage('timeOffsets', newOffsets);
  };

  const toggleSwitch = (key: string, switches: { [key: string]: boolean }, setSwitches: any) => {
    const newValue = !switches[selectedPrayerTime.vakit];
    const newSwitches = { ...switches, [selectedPrayerTime.vakit]: newValue };
    setSwitches(newSwitches);
    saveToStorage(key, newSwitches);
  };

  const handleVaktindeSwitch = async () => {
    const newValue = !vaktindeSwitches[selectedPrayerTime.vakit];
    
    if (newValue) {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await schedulePrayerNotification(
          selectedPrayerTime.vakit,
          selectedPrayerTime.time,
          0,
          true
        );
      }
    } else {
      await cancelPrayerNotifications(selectedPrayerTime.vakit);
    }
    
    toggleSwitch('vaktindeSwitches', vaktindeSwitches, setVaktindeSwitches);
  };

  const handleDkOnceSwitch = async () => {
    const newValue = !dkOnceSwitches[selectedPrayerTime.vakit];
    
    if (newValue) {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await schedulePrayerNotification(
          selectedPrayerTime.vakit,
          selectedPrayerTime.time,
          timeOffsets[selectedPrayerTime.vakit] || 0,
          false
        );
      }
    } else {
      await cancelPrayerNotifications(selectedPrayerTime.vakit);
    }
    
    toggleSwitch('dkOnceSwitches', dkOnceSwitches, setDkOnceSwitches);
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      animateOnMount={true}
      index={0}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colorScheme == 'light' ? '#DDDDDD' : '#31363F' }}
      handleIndicatorStyle={{ backgroundColor: '#DA0037' }}>
      <View className="items-center">
        <Text className="font-bold text-3xl color-dark-settingsItem dark:color-light-settingsItem">
          {selectedPrayerTime.vakit}
        </Text>
      </View>
      <ItemSeperator />
      <View className="flex-col">
        <View className="flex-row px-4 justify-between items-center">
          <Text className="font-bold text-lg color-dark-settingsItem dark:color-light-settingsItem">
            Vaktinde
          </Text>
          <Switch
            className="size-10"
            trackColor={{ false: '#DDDDDD', true: '#171717' }}
            thumbColor={'#DA0037'}
            ios_backgroundColor="#444444"
            onValueChange={handleVaktindeSwitch}
            value={vaktindeSwitches[selectedPrayerTime.vakit] || false}
          />
        </View>
        <ItemSeperator />
        <View className="flex-row px-4 justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => updateTimeOffset(false)}
              disabled={!dkOnceSwitches[selectedPrayerTime.vakit]}>
              <Text className="font-bold text-2xl mr-1 color-dark-settingsItemTwo dark:color-light-settingsItemTwo">
                −{' '}
              </Text>
            </TouchableOpacity>
            <Text className="text-lg color-dark-settingsItem dark:color-light-settingsItem">
              {timeOffsets[selectedPrayerTime.vakit] || 0}
            </Text>
            <TouchableOpacity
              onPress={() => updateTimeOffset(true)}
              disabled={!dkOnceSwitches[selectedPrayerTime.vakit]}>
              <Text className="font-bold text-2xl mx-1 color-dark-settingsItemTwo dark:color-light-settingsItemTwo">
                {' '}
                +
              </Text>
            </TouchableOpacity>
            <Text className="text-lg color-dark-settingsItem dark:color-light-settingsItem">
              {' '}
              dk önce
            </Text>
          </View>
          <View>
            <Switch
              className="size-10"
              trackColor={{ false: '#DDDDDD', true: '#171717' }}
              thumbColor={'#DA0037'}
              ios_backgroundColor="#444444"
              onValueChange={handleDkOnceSwitch}
              value={dkOnceSwitches[selectedPrayerTime.vakit] || false}
            />
          </View>
        </View>
        {/* <ItemSeperator />
        <Button title="Test Bildirimi Gönder" onPress={testNotification} /> */}
      </View>
    </BottomSheetModal>
  );
});

export default AlarmBottomSheet;
