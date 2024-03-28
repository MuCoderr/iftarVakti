import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { lightColors, darkColors } from 'src/utils/colors';
import { DateTime, Interval } from 'luxon';
import { formatTime } from '../utils/functions';

interface imsakAndIftarCountdownProps {
  todayPrayerTimes: any;
  tomorrowPrayerTimes: any;
}

export default function ImsakAndIftarCountdown({
  todayPrayerTimes,
  tomorrowPrayerTimes,
}: imsakAndIftarCountdownProps) {
  const [timeRemainingImsak, setTimeRemainingImsak] = useState<string>('');
  const [timeRemainingAkşam, setTimeRemainingAkşam] = useState<string>('');
  const [isImsakTime, setIsImsakTime] = useState<boolean>();

  const color = lightColors;

  useEffect(() => {
    if (todayPrayerTimes && tomorrowPrayerTimes) {
      const timeRemaining = () => {
        const suankiSaat = DateTime.now();
        const imsakVakti = DateTime.fromISO(todayPrayerTimes.Imsak);
        const tomorrowImsakVakti = DateTime.fromISO(tomorrowPrayerTimes.Imsak);
        const aksamVakti = DateTime.fromISO(todayPrayerTimes.Aksam);

        if (suankiSaat < imsakVakti) {
          // Şu an imsak vaktinden önce
          setIsImsakTime(true);
          const kalanSureInterval = Interval.fromDateTimes(suankiSaat, imsakVakti);
          const kalanSureString: any = kalanSureInterval
            .toDuration(['hours', 'minutes', 'seconds'])
            .toObject();
          setTimeRemainingImsak(
            formatTime(kalanSureString.hours, kalanSureString.minutes, kalanSureString.seconds)
          );
        } else if (suankiSaat < aksamVakti) {
          // Şu an imsak vaktinden sonra ve akşam vaktinden önce
          setIsImsakTime(false);
          const kalanSureInterval = Interval.fromDateTimes(suankiSaat, aksamVakti);
          const kalanSureString: any = kalanSureInterval
            .toDuration(['hours', 'minutes', 'seconds'])
            .toObject();
          setTimeRemainingAkşam(
            formatTime(kalanSureString.hours, kalanSureString.minutes, kalanSureString.seconds)
          );
        } else {
          // Şu an akşam vaktinden sonra
          setIsImsakTime(true);
          const imsakVaktiYarin = tomorrowImsakVakti.plus({ days: 1 });
          const kalanSureInterval = Interval.fromDateTimes(suankiSaat, imsakVaktiYarin);
          const kalanSureString: any = kalanSureInterval
            .toDuration(['hours', 'minutes', 'seconds'])
            .toObject();
          setTimeRemainingImsak(
            formatTime(kalanSureString.hours, kalanSureString.minutes, kalanSureString.seconds)
          );
        }
      };

      timeRemaining();

      const intervalId = setInterval(timeRemaining, 1000);
      // Komponent unmount olduğunda clearInterval kullanarak güncelleme işlemini durdur
      return () => clearInterval(intervalId);
    }
  }, [todayPrayerTimes, tomorrowPrayerTimes]);

  return (
    <View className="flex-auto items-center ">
      <Text className={`mb-[10] color-[${color.secondary}]/50`}>
        {todayPrayerTimes.HicriTarihUzun} / {todayPrayerTimes.MiladiTarihKisa}
      </Text>

      <Text className="font-bold text-2xl">
        {isImsakTime ? 'İmsak Vaktine Kalan Süre' : ' İftar Vaktine Kalan Süre'}
      </Text>
      <Text className={`text-[80px] font-extrabold color-[${color.primary}]`}>
        {isImsakTime ? timeRemainingImsak : timeRemainingAkşam}
      </Text>
      <View className="flex-row gap-[60] -mt-3 ">
        <Text className={`color-[${color.secondary}]/50`}>saat</Text>
        <Text className={`color-[${color.secondary}]/50`}>dakika</Text>
        <Text className={`color-[${color.secondary}]/50`}>saniye</Text>
      </View>
    </View>
  );
}
