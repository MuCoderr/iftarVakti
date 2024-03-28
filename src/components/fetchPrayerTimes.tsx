import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Redux
import { getPrayerTimes } from '~/src/redux/api';
import { useDispatch } from 'react-redux';
import { setPrayerTimes } from '~/src/redux/slices/prayerTimes';
// Utils
import { formatDate } from '~/src/utils/functions';

interface FetchPrayerTimesProps {
  districtID: any;
  setTodayPrayerTimes: any;
  setTomorrowPrayerTimes: any;
}

const FetchPrayerTimes = ({
  districtID,
  setTodayPrayerTimes,
  setTomorrowPrayerTimes,
}: FetchPrayerTimesProps) => {
  const [firstDate, setFirstDate] = useState<any>('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (districtID) {
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
        });
      }
    }
  }, [districtID, setTodayPrayerTimes, setTomorrowPrayerTimes]);

  return null;
};

export default FetchPrayerTimes;
