import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DateTime, Interval } from 'luxon';
import { formatTime } from '../utils/functions';

interface PrayerTimeItemProps {
  todayPrayerTimes: any;
}
export default function PrayerTimesItem({ todayPrayerTimes }: PrayerTimeItemProps) {
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [nextVakit, setNextVakit] = useState<string>('');

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

  return (
    <View className="flex-auto items-center ">
        <Text className={`mb-[10] color-light-secondary/50 dark:color-dark-secondary/50`}>
        {todayPrayerTimes.HicriTarihUzun} / {todayPrayerTimes.MiladiTarihKisa}
      </Text>

      <Text className="font-bold text-2xl color-light-secondary dark:color-dark-secondary">
        {nextVakit} Vaktine Kalan Süre
      </Text>

      {nextPrayer && (            
            <Text className="font-bold text-[80px] color-light-primary dark:color-dark-primary">{nextPrayer}</Text>
        )}
        
      <View className="flex-row gap-[60] -mt-3 ">
        <Text className={`color-light-secondary/50 dark:color-dark-secondary/50`}>saat</Text>
        <Text className={`color-light-secondary/50 dark:color-dark-secondary/50`}>dakika</Text>
        <Text className={`color-light-secondary/50 dark:color-dark-secondary/50`}>saniye</Text>
      </View>
    </View>
  );
}