import React, { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime, Interval } from 'luxon';

import { getPrayerTimes } from '../redux/api';
import prayerTimes, { setPrayerTimes } from '../redux/slices/prayerTimes';

export default function Prayer() {
  const [districtID, setDistrictID] = useState(null);
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any | null>(null);
  const [tomorrowPrayerTimes, setTomorrowPrayerTimes] = useState<any | null>(null);
  const [timeRemainingImsak, setTimeRemainingImsak] = useState<string>('');
  const [timeRemainingAkşam, setTimeRemainingAkşam] = useState<string>('');
  const [isImsakTime, setIsImsakTime] = useState<boolean>();
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [nextVakit, setNextVakit] = useState<string>('');
  const [cityName, setCityName] = useState<string | null>('');
  const [districtName, setDistrictName] = useState<string | null>('');
  const [firstDate, setFirstDate] = useState<any>('');

  const dispatch = useDispatch();

  useEffect(() => {
    const getDistrictValue = async () => {
      const districtValue: any = await AsyncStorage.getItem(`districtValue`);
      setDistrictID(districtValue);
    };

    getDistrictValue();

    const getPrayerTimesDateFromAsyncStorage = async () => {
      const prayerTimesDate: any = await AsyncStorage.getItem('prayerTimesDate');
      setFirstDate(prayerTimesDate);

      if (prayerTimesDate) {
        const today = new Date();
        const firstDate = new Date(prayerTimesDate);
        const differenceInMilliseconds = today.getTime() - firstDate.getTime();
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 3600 * 24));

        if (differenceInDays >= 1) {
          const data = await getPrayerTimes(districtID);
          dispatch(setPrayerTimes(data));
          await AsyncStorage.setItem('prayerTimes', JSON.stringify(data));
          await AsyncStorage.setItem('prayerTimesDate', new Date().toISOString());
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
        //  console.warn("localde namaz vakitleri olmadığından api'dan çekildi");

        await AsyncStorage.setItem('prayerTimes', JSON.stringify(data));
        await AsyncStorage.setItem('prayerTimesDate', new Date().toISOString());

        return data;
      };

      getPrayerTimesFromAsyncStorage().then((data) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
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

        if (todayPrayerTimes) {
          const timeRemaining = () => {
            const suankiSaat = DateTime.now();
            const imsakVakti = DateTime.fromISO(todayPrayerTimes.Imsak);
            const tomorrowImsakVakti = DateTime.fromISO(tomorrowPrayerTimes.Imsak);
            const aksamVakti = DateTime.fromISO(todayPrayerTimes.Aksam);
            imsakVakti < suankiSaat && setIsImsakTime(false);
            suankiSaat > aksamVakti && setIsImsakTime(true);

            if (suankiSaat < imsakVakti) {
              // Şu an imsak vaktinden önce
              const kalanSureInterval = Interval.fromDateTimes(suankiSaat, imsakVakti);
              const kalanSureString: any = kalanSureInterval
                .toDuration(['hours', 'minutes', 'seconds'])
                .toObject();
              setTimeRemainingImsak(
                formatTime(kalanSureString.hours, kalanSureString.minutes, kalanSureString.seconds)
              );
            } else if (suankiSaat < aksamVakti) {
              // Şu an imsak vaktinden sonra ve akşam vaktinden önce
              const kalanSureInterval = Interval.fromDateTimes(suankiSaat, aksamVakti);
              const kalanSureString: any = kalanSureInterval
                .toDuration(['hours', 'minutes', 'seconds'])
                .toObject();
              setTimeRemainingAkşam(
                formatTime(kalanSureString.hours, kalanSureString.minutes, kalanSureString.seconds)
              );
            } else {
              // Şu an akşam vaktinden sonra
              const imsakVaktiYarin = tomorrowImsakVakti.plus({ days: 1 });
              const kalanSureInterval = Interval.fromDateTimes(suankiSaat, imsakVaktiYarin);
              const kalanSureString: any = kalanSureInterval
                .toDuration(['hours', 'minutes', 'seconds'])
                .toObject();
              setTimeRemainingImsak(
                formatTime(kalanSureString.hours, kalanSureString.minutes, kalanSureString.seconds)
              );
            }

            const namazVakitleri = {
              imsak: todayPrayerTimes.Imsak,
              gunes: todayPrayerTimes.Gunes,
              ogle: todayPrayerTimes.Ogle,
              ikindi: todayPrayerTimes.Ikindi,
              aksam: todayPrayerTimes.Aksam,
              yatsi: todayPrayerTimes.Yatsi,
            };

            let nextPrayerFound = false;

            // Her bir vakit için kalan süreleri kontrol eder
            for (const [vakit, vakitSaat] of Object.entries(namazVakitleri)) {
              const vakitDateTime = DateTime.fromISO(vakitSaat);
              if (vakitDateTime > suankiSaat && !nextPrayerFound) {
                const kalanSureInterval = Interval.fromDateTimes(suankiSaat, vakitDateTime);
                const kalanSureString: any = kalanSureInterval
                  .toDuration(['hours', 'minutes', 'seconds'])
                  .toObject();

                let vakitString = '';
                vakit === 'imsak'
                  ? (vakitString = 'İmsak')
                  : vakit === 'gunes'
                    ? (vakitString = 'Güneş')
                    : vakit === 'ogle'
                      ? (vakitString = 'Öğle')
                      : vakit === 'ikindi'
                        ? (vakitString = 'İkindi')
                        : vakit === 'aksam'
                          ? (vakitString = 'Akşam')
                          : vakit === 'yatsi'
                            ? (vakitString = 'Yatsı')
                            : '';

                setNextVakit(`${vakitString}`);
                setNextPrayer(
                  formatTime(
                    kalanSureString.hours,
                    kalanSureString.minutes,
                    kalanSureString.seconds
                  )
                );
                nextPrayerFound = true;
              }
            }

            if (!nextPrayerFound) {
              setNextPrayer('Bugün için son namaz vakti geçmiş.');
            }
          };

          timeRemaining();

          const intervalId = setInterval(timeRemaining, 1000);
          // Komponent unmount olduğunda clearInterval kullanarak güncelleme işlemini durdur
          return () => clearInterval(intervalId);
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
  }, [districtID, nextVakit]);

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Saat, dakika ve saniye değerlerini iki haneli olarak biçimlendiren yardımcı bir fonksiyon
  const formatTime = (hours: number, minutes: number, seconds: number) => {
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(Math.floor(seconds)).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

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

          {todayPrayerTimes ? (
            <>
              <View className="flex-auto items-center ">
                <Text className="mb-[10] color-[#171717]/50">
                  {todayPrayerTimes.HicriTarihKisa} / {todayPrayerTimes.MiladiTarihKisa}
                </Text>

                <Text className="font-bold text-2xl">
                  {isImsakTime ? 'İmsak Vaktine Kalan Süre' : ' İftar Vaktine Kalan Süre'}
                </Text>
                <Text className="text-[80px] font-extrabold color-[#DA0037]">
                  {isImsakTime ? timeRemainingImsak : timeRemainingAkşam}
                </Text>
                <View className="flex-row gap-[60] -mt-3 ">
                  <Text className="color-[#171717]/50">saat</Text>
                  <Text className="color-[#171717]/50">dakika</Text>
                  <Text className="color-[#171717]/50">saniye</Text>
                </View>
              </View>

              <View className="flex-auto justify-end mb-[100] items-center ">
                <View className="mb-3">
                  <Text className="font-bold  text-2xl">
                    {nextVakit} Vaktine <Text className=" color-[#DA0037]">{nextPrayer}</Text>
                  </Text>
                </View>
                <View className=" flex-row">
                  <PrayerTimeItem title="İmsak" time={todayPrayerTimes.Imsak} />
                  <PrayerTimeItem title="Güneş" time={todayPrayerTimes.Gunes} />
                  <PrayerTimeItem title="Öğle" time={todayPrayerTimes.Ogle} />
                  <PrayerTimeItem title="İkindi" time={todayPrayerTimes.Ikindi} />
                  <PrayerTimeItem title="Akşam" time={todayPrayerTimes.Aksam} />
                  <PrayerTimeItem title="Yatsı" time={todayPrayerTimes.Yatsi} />
                </View>
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>...</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </>
  );
}
