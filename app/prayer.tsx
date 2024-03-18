import React, { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { getPrayerTimes } from '../redux/api';
import { setPrayerTimes } from '../redux/slices/prayerTimes';

export default function Prayer() {
  const [districtID, setDistrictID] = useState(null);
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any | null>(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState<any | null>(null); // Yarın için namaz vakitlerini ekledik
  const [timeRemainingImsak, setTimeRemainingImsak] = useState<string>('');
  const [timeRemainingAkşam, setTimeRemainingAkşam] = useState<string>('');
  const [isImsakTime, setIsImsakTime] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string | null>('');
  const [districtName, setDistrictName] = useState<string | null>('');
  const [firstDate, setFirstDate] = useState<any>('');

  const prayerTimesData = useSelector((state: any) => state.prayerTimes.prayerTimes);

  const dispatch = useDispatch();

  useEffect(() => {
    const getDistrictValue = async () => {
      const districtValue: any = await AsyncStorage.getItem(`districtValue`);
      setDistrictID(districtValue);
    };

    getDistrictValue(); // İlk olarak ilçe kodunu al

    const getPrayerTimesDateFromAsyncStorage = async () => {
      const prayerTimesDate: any = await AsyncStorage.getItem('prayerTimesDate');
      setFirstDate(prayerTimesDate);

      if (prayerTimesDate) {
        // Check if data is retrieved successfully
        const today = new Date();
        const firstDate = new Date(prayerTimesDate);
        const differenceInMilliseconds = today.getTime() - firstDate.getTime();
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 3600 * 24));
        // console.error('Gün farkı', differenceInDays);

        if (differenceInDays >= 1) {
          const data = await getPrayerTimes(districtID);
          dispatch(setPrayerTimes(data));
          await AsyncStorage.setItem('prayerTimes', JSON.stringify(data));
          await AsyncStorage.setItem('prayerTimesDate', new Date().toISOString());

          // console.warn('Namaz Vakitleri Güncellendi');
          // console.error('Namaz vakti ilk gün', prayerTimesDate);
          // console.error(prayerTimesData);
        }
      }
    };
    getPrayerTimesDateFromAsyncStorage();

    if (districtID) {
      // districtID varsa namaz vakitlerini al
      const getPrayerTimesFromAsyncStorage = async () => {
        const prayerTimesData = await AsyncStorage.getItem(`prayerTimes`);

        // Veri daha önce kaydedilmişse AsyncStorage'dan çek
        if (prayerTimesData) {
          const prayerTimes = JSON.parse(prayerTimesData);
          dispatch(setPrayerTimes(prayerTimes)); // Veriyi store'a aktar
          // console.warn("kayıtlı namaz vakti verileri local'den çekildi");
          return prayerTimes;
        }

        // Veri daha önce kaydedilmemişse API'dan çek ve kaydet
        const data = await getPrayerTimes(districtID);
        dispatch(setPrayerTimes(data));
        // console.warn("localde namaz vakitleri olmadığından api'dan çekildi");

        await AsyncStorage.setItem('prayerTimes', JSON.stringify(data));
        await AsyncStorage.setItem('prayerTimesDate', new Date().toISOString());

        return data;
      };

      getPrayerTimesFromAsyncStorage().then((data) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Yarın için tarihi hesapla

        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Ocak 0'dan başlar
        const year = today.getFullYear();

        const formattedToday = `${day}.${month}.${year}`;

        const todayPrayerTimes = data.find(
          (item: any) => item.MiladiTarihKisaIso8601 === formattedToday
        );
        const tomorrowPrayerTimes = data.find(
          (item: any) => item.MiladiTarihKisaIso8601 === formatDate(tomorrow)
        );
        setTodayPrayerTimes(todayPrayerTimes);
        setTomorrowPrayerTimes(tomorrowPrayerTimes);

        // Imsak ve akşam vaktine kalan süreyi hesapla ve güncelle
        if (todayPrayerTimes) {
          const imsakTime = todayPrayerTimes.Imsak.split(':');
          const imsakDate = new Date();
          imsakDate.setHours(Number(imsakTime[0]));
          imsakDate.setMinutes(Number(imsakTime[1]));
          imsakDate.setSeconds(0);

          const akşamTime = todayPrayerTimes.Aksam.split(':');
          const akşamDate = new Date();
          akşamDate.setHours(Number(akşamTime[0]));
          akşamDate.setMinutes(Number(akşamTime[1]));
          akşamDate.setSeconds(0);

          const now = new Date();

          if (now > akşamDate) {
            imsakDate.setDate(imsakDate.getDate() + 1); // Bir sonraki imsak vaktine geç
          }

          const timeDifferenceImsak = imsakDate.getTime() - now.getTime();
          const timeDifferenceAkşam = akşamDate.getTime() - now.getTime();
          const timeRemainingStringImsak = formatTimeRemaining(timeDifferenceImsak);
          const timeRemainingStringAkşam = formatTimeRemaining(timeDifferenceAkşam);
          setTimeRemainingImsak(timeRemainingStringImsak);
          setTimeRemainingAkşam(timeRemainingStringAkşam);
          setIsImsakTime(now < imsakDate); // Şu an imsak vaktine kadar olan sürede miyiz?

          // Zamanlayıcı oluştur ve her saniyede bir zamanı güncelle
          const timer = setInterval(() => {
            const now = new Date();
            const timeDifferenceImsak = imsakDate.getTime() - now.getTime();
            const timeDifferenceAkşam = akşamDate.getTime() - now.getTime();
            const timeRemainingStringImsak = formatTimeRemaining(timeDifferenceImsak);
            const timeRemainingStringAkşam = formatTimeRemaining(timeDifferenceAkşam);
            setTimeRemainingImsak(timeRemainingStringImsak);
            setTimeRemainingAkşam(timeRemainingStringAkşam);
            setIsImsakTime(now < imsakDate); // Şu an imsak vaktine kadar olan sürede miyiz?
          }, 1000);

          return () => clearInterval(timer); // Temizleme fonksiyonu
        }
      });

      const getCityNameAndDistrictNameFromAsyncStorage = async () => {
        const cityName = await AsyncStorage.getItem('cityName');
        const districtName = await AsyncStorage.getItem('districtName');

        setCityName(cityName);
        setDistrictName(districtName);
      };
      getCityNameAndDistrictNameFromAsyncStorage();
    }
  }, [districtID]);

  // Kullanılacak zaman formatı
  const formatTimeRemaining = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const PrayerTimeItem = ({ title, time }: any) => {
    return (
      <View className="justify-center items-center mb-[5] mx-2">
        <Text className="font-bold">{title}</Text>
        <Text className="font-semibold color-[#DA0037]">{time}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require('../assets/images/background.png')}
        className="flex-1"
        imageStyle={{ opacity: 0.2 }}>
        <View className="flex-1 justify-between items-center ">
          <View className="flex-none  p-[10] rounded-full m-10 ">
            <TouchableOpacity
              onPress={() => {
                AsyncStorage.clear();
                // console.error('AsyncStorage tüm verisi silindi');
                router.navigate('/locationSelect');
              }}>
              <View className="flex-row items-center">
                <FontAwesome6 name="location-dot" size={24} color="#DA0037" className="mr-2" />
                <Text className="color-[#DA0037] font-bold p-[3]">
                  {cityName} / {districtName}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-auto items-center ">
            {todayPrayerTimes && (
              <>
                <Text className="mb-[10] color-[#171717]/50">
                  {todayPrayerTimes.HicriTarihKisa} / {todayPrayerTimes.MiladiTarihKisa}
                </Text>
              </>
            )}
            <Text className="font-bold text-2xl mb-[15]">
              {isImsakTime ? 'İmsak Vaktine Kalan Süre' : ' İftar Vaktine Kalan Süre'}
            </Text>
            <Text className="p-1 text-8xl font-extrabold color-[#DA0037]">
              {isImsakTime ? timeRemainingImsak : timeRemainingAkşam}
            </Text>
          </View>

          <View className="flex-auto flex-row justify-between mt-[150]">
            {todayPrayerTimes && (
              <>
                <PrayerTimeItem title="İmsak" time={todayPrayerTimes.Imsak} />
                <PrayerTimeItem title="Güneş" time={todayPrayerTimes.Gunes} />
                <PrayerTimeItem title="Öğle" time={todayPrayerTimes.Ogle} />
                <PrayerTimeItem title="İkindi" time={todayPrayerTimes.Ikindi} />
                <PrayerTimeItem title="Akşam" time={todayPrayerTimes.Aksam} />
                <PrayerTimeItem title="Yatsı" time={todayPrayerTimes.Yatsi} />
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </>
  );
}
