import React, { useEffect, useState } from 'react';
import { View, ImageBackground, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Components
import LocationItem from '~/src/components/locationItem';
import ImsakAndIftarCountdown from '~/src/components/imsakAndIftarCountdown';
import PrayerTimesItem from '~/src/components/prayerTimesItem';
import FetchPrayerTimes from '~/src/components/fetchPrayerTimes';

export default function Prayer() {
  const [districtID, setDistrictID] = useState(null);
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any | null>(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState<any | null>(null);

  useEffect(() => {
    const getDistrictValue = async () => {
      const districtValue: any = await AsyncStorage.getItem(`districtValue`);
      setDistrictID(districtValue);
    };
    getDistrictValue();
  }, [districtID]);

  // const backgroundImageSource = isDarkMode
  //   ? require('../../assets/images/background.png')
  //   : require('../../assets/images/backgroundDark.png');

  return (
    <>
      <ImageBackground
        source={require('../../src/assets/images/background.png')}
        className="flex-1"
        imageStyle={{ opacity: 0.2 }}>
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
