import React, { useEffect, useState } from 'react';
import { View, ImageBackground, ActivityIndicator, Text } from 'react-native';
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

export default function Prayer() {
  const [districtID, setDistrictID] = useState(null);
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any | null>(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState<any | null>(null);

  const { colorScheme } = useColorScheme();

  const { ramadanMode } = useSelector((state: any) => state.ramadanMode);

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
                <PrayerTimesItem todayPrayerTimes={todayPrayerTimes} />
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
                <PrayerTimesItem todayPrayerTimes={todayPrayerTimes} />
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
