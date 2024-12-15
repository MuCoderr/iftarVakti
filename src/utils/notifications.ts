import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DateTime } from 'luxon';

// Bildirim ayarlarını yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Bildirim izinlerini iste
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Bildirimi planla
export async function schedulePrayerNotification(
  prayerName: string,
  prayerTime: string,
  minutesBefore: number = 0,
  onTime: boolean = true
) {
  try {
    // Önce varolan bildirimleri temizle
    await cancelPrayerNotifications(prayerName);

    const prayerDateTime = DateTime.fromISO(prayerTime);
    
    if (onTime) {
      // Vaktinde bildirim
      const trigger = new Date(prayerDateTime.toJSDate());
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayerName} Vakti`,
          body: `${prayerName} vakti girdi`,
        },
        trigger,
      });
    }

    if (minutesBefore > 0) {
      // Dakika öncesi bildirim
      const beforeDateTime = prayerDateTime.minus({ minutes: minutesBefore });
      const triggerBefore = new Date(beforeDateTime.toJSDate());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayerName} Vakti Yaklaşıyor`,
          body: `${prayerName} vaktine ${minutesBefore} dakika kaldı`,
        },
        trigger: triggerBefore,
      });
    }

    return true;
  } catch (error) {
    console.error('Bildirim planlanırken hata:', error);
    return false;
  }
}

// Belirli bir vakit için bildirimleri iptal et
export async function cancelPrayerNotifications(prayerName: string) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.title?.includes(prayerName)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
} 