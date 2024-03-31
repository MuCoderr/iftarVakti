import React, { useEffect, useState } from 'react';
import { View, ImageBackground, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Components
import LocationItem from '../../components/locationItem';
import ImsakAndIftarCountdown from '../../components/imsakAndIftarCountdown';
import PrayerTimesItem from '../../components/prayerTimesItem';
import FetchPrayerTimes from '../../components/fetchPrayerTimes';
import { useColorScheme } from 'nativewind';

export default function Prayer() {
  const [districtID, setDistrictID] = useState(null);
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any | null>(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState<any | null>(null);

  const { colorScheme } = useColorScheme();

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
        <View className="flex-1 justify-between items-center ">
          <LocationItem />
          {todayPrayerTimes ? (
            <>
              <ImsakAndIftarCountdown
                todayPrayerTimes={todayPrayerTimes}
                tomorrowPrayerTimes={tomorrowPrayerTimes}
              />
              <PrayerTimesItem todayPrayerTimes={todayPrayerTimes} />
            </>
          ) : (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator />
            </View>
          )}
        </View>
      </ImageBackground>
    </>
  );
}
