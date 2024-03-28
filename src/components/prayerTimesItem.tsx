import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { lightColors, darkColors } from 'src/utils/colors';
import { DateTime, Interval } from 'luxon';
import { formatTime } from '../utils/functions';

interface PrayerTimeItemProps {
  todayPrayerTimes: any;
}
export default function PrayerTimesItem({ todayPrayerTimes }: PrayerTimeItemProps) {
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [nextVakit, setNextVakit] = useState<string>('');
  const color = lightColors;

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

  const PrayerTimeItem = ({ title, time }: any) => {
    return (
      <View className="justify-center items-center mb-[5] mx-2">
        <Text className="font-bold">{title}</Text>
        <Text className="font-semibold color-[#DA0037]">{time}</Text>
      </View>
    );
  };

  return (
    <View className="flex-auto justify-end mb-[90] items-center ">
      <View className="mb-3">
        {nextPrayer && (
          <Text className="font-bold  text-2xl">
            {nextVakit} Vaktine <Text className={`color-[${color.primary}]`}>{nextPrayer}</Text>
          </Text>
        )}
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
  );
}
