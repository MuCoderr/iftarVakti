import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Components
import LocationItem from '../../components/locationItem';
import ImsakAndIftarCountdown from '../../components/imsakAndIftarCountdown';
import PrayerTimesItem from '../../components/prayerTimesItem';
import FetchPrayerTimes from '../../components/fetchPrayerTimes';
import PrayerCountdownItem from '../../components/prayerCountdownItem';
import { useColorScheme } from 'nativewind';
// Redux
import { useSelector } from 'react-redux';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import AlarmBottomSheet from '~/src/components/alarmBottomSheet';

export default function Prayer() {
  const [districtID, setDistrictID] = useState(null);
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any | null>(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState<any | null>(null);

  const { ramadanMode } = useSelector((state: any) => state.ramadanMode);
  
  const { colorScheme } = useColorScheme();

  //BottomSheet
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {dismiss} = useBottomSheetModal();
  const handlePresentBottomSheet = () => { 
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    const getDistrictValue = async () => {
      const districtValue: any = await AsyncStorage.getItem(`districtValue`);
      setDistrictID(districtValue);
    };
    getDistrictValue();
  }, [districtID]);


  return (
    <>
      <ImageBackground
        source={
          colorScheme == 'light'
            ? require('../../assets/images/backgroundLight.png')
            : require('../../assets/images/backgroundDark.png')
        }
        className="flex-1">
        <FetchPrayerTimes
          districtID={districtID}
          setTodayPrayerTimes={setTodayPrayerTimes}
          setTomorrowPrayerTimes={setTomorrowPrayerTimes}
        />

        {ramadanMode === true ? (
          <View className="flex-1 justify-between items-center ">
            <LocationItem />
            {todayPrayerTimes ? (
              <>
                <ImsakAndIftarCountdown
                  todayPrayerTimes={todayPrayerTimes}
                  tomorrowPrayerTimes={tomorrowPrayerTimes}
                />
                <PrayerTimesItem openBottomSheet={handlePresentBottomSheet} todayPrayerTimes={todayPrayerTimes} />
                <AlarmBottomSheet 
                  ref={bottomSheetRef} 
                  dismiss={dismiss} />
              </>
            ) : (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator />
              </View>
            )}
          </View>
        ) : (
          <View className="flex-1 justify-between items-center">
            <LocationItem />
            {todayPrayerTimes ? (
              <>
                <PrayerCountdownItem todayPrayerTimes={todayPrayerTimes} 
                  tomorrowPrayerTimes={tomorrowPrayerTimes} />
                <PrayerTimesItem openBottomSheet={handlePresentBottomSheet} todayPrayerTimes={todayPrayerTimes} />
                <AlarmBottomSheet 
                todayPrayerTimes={todayPrayerTimes}
                  ref={bottomSheetRef} 
                  dismiss={dismiss} />
              </>
            ) : (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator />
              </View>
            )}
          </View>
        )}
      </ImageBackground>
    </>
  );
}
