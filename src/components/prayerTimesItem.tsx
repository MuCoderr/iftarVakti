import { Text, View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DateTime, Interval } from 'luxon';
import { formatTime } from '../utils/functions';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedPrayerTime } from '../redux/slices/selectedPrayerTimesItem';

interface PrayerTimeItemProps {
  openBottomSheet: () => void;
  todayPrayerTimes: any;
}
export default function PrayerTimesItem({openBottomSheet , todayPrayerTimes }: PrayerTimeItemProps) {
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [nextVakit, setNextVakit] = useState<string>('');

  const dispatch = useDispatch();

  const { ramadanMode } = useSelector((state: any) => state.ramadanMode);

  useEffect(() => {
    if (todayPrayerTimes) {
      const timeRemaining = () => {
        const suankiSaat = DateTime.now();

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
              formatTime(kalanSureString.hours, kalanSureString.minutes, kalanSureString.seconds)
            );
            nextPrayerFound = true;
          }
        }

        if (!nextPrayerFound) {
          setNextPrayer('');
        }
      };

      timeRemaining();

      const intervalId = setInterval(timeRemaining, 1000);
      // Komponent unmount olduğunda clearInterval kullanarak güncelleme işlemini durdur
      return () => clearInterval(intervalId);
    }
  }, []);

  const handlePress = (vakit: string, time: string) => {
    dispatch(setSelectedPrayerTime({ vakit, time }));
    openBottomSheet();
  };

  const PrayerTimeItem = ({ title, time, onPress }: any) => {
    return (
      <View className="justify-center items-center mb-[5] mx-2" >
        <Text className="font-bold color-light-secondary dark:color-dark-secondary" onPress={onPress}>{title}</Text>
        <Text className="font-semibold color-light-primary dark:color-dark-primary" onPress={onPress}>{time}</Text>
      </View>
    );
  };

  return (
    <View className="flex-auto justify-end mb-[90] items-center ">
      {ramadanMode === true ? 
      (
      <View className="mb-3">
        {nextPrayer && (
          <Text className="font-bold text-2xl color-light-secondary dark:color-dark-secondary">
            {nextVakit} Vaktine{' '}
            <Text className="color-light-primary dark:color-dark-primary">{nextPrayer}</Text>
          </Text>
        )}
      </View>
      ): null
      }
        <View className=" flex-row">
          <PrayerTimeItem title="İmsak" time={todayPrayerTimes.Imsak} onPress={() => handlePress('İMSAK', todayPrayerTimes.Imsak)}  />
          <PrayerTimeItem title="Güneş" time={todayPrayerTimes.Gunes} onPress={() => handlePress('GÜNEŞ', todayPrayerTimes.Gunes)} />
          <PrayerTimeItem title="Öğle" time={todayPrayerTimes.Ogle} onPress={() => handlePress('ÖĞLE', todayPrayerTimes.Ogle)} />
          <PrayerTimeItem title="İkindi" time={todayPrayerTimes.Ikindi} onPress={() => handlePress('İKİNDİ', todayPrayerTimes.Ikindi)} />
          <PrayerTimeItem title="Akşam" time={todayPrayerTimes.Aksam} onPress={() => handlePress('AKŞAM', todayPrayerTimes.Aksam)} />
          <PrayerTimeItem title="Yatsı" time={todayPrayerTimes.Yatsi} onPress={() => handlePress('YATSI', todayPrayerTimes.Yatsi)} />
        </View>
    </View>
  );
}
