import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface DayTime {
  weekday: number;
  hour: number;
  minute: number;
}

interface ReminderData {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string | null;
  notificationId?: string;
  frequency?: 'none' | 'daily' | 'weekly' | 'custom';
  customSchedule?: DayTime[];
}

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return false;
    }
    return true;
  }

  async scheduleNotification(reminder: ReminderData): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    let notificationContent: Notifications.NotificationContentInput = {
      title: reminder.title,
      body: reminder.description || 'Your reminder',
      data: { id: reminder.id },
    };

    // Attach image
    if (reminder.image) {
      if (Platform.OS === 'ios') {
        const filename = reminder.image.split('/').pop() || 'image.jpg';
        const destFolder = `${FileSystem.documentDirectory}notifications/`;
        const dirInfo = await FileSystem.getInfoAsync(destFolder);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(destFolder, { intermediates: true });
        }
        const destPath = `${destFolder}${filename}`;
        try {
          await FileSystem.copyAsync({ from: reminder.image, to: destPath });
          notificationContent.attachments = [{ url: destPath, identifier: destPath, type: 'image' }];
        } catch (e) {
          console.error('Error copying image for notification', e);
        }
      } else if (Platform.OS === 'android') {
        notificationContent.attachments = [{ url: reminder.image, identifier: reminder.image, type: 'image' }];
      }
    }

    // If "custom," schedule multiple weekly notifications
    if (reminder.frequency === 'custom' && reminder.customSchedule?.length) {
      let lastNotificationId: string | null = null;
      for (const combo of reminder.customSchedule) {
        const trigger = {
          type: 'calendar',
          repeats: true,
          weekday: combo.weekday,
          hour: combo.hour,
          minute: combo.minute,
        } as any;
        try {
          lastNotificationId = await Notifications.scheduleNotificationAsync({
            content: notificationContent,
            trigger,
          });
        } catch (error) {
          console.error('Error scheduling custom notification:', error);
        }
      }
      return lastNotificationId;
    }

    // Otherwise, handle none/daily/weekly
    const date = new Date(reminder.date);
    let trigger: Notifications.NotificationTriggerInput;

    if (reminder.frequency === 'daily') {
      trigger = {
        type: 'calendar',
        repeats: true,
        hour: date.getHours(),
        minute: date.getMinutes(),
      } as any;
    } else if (reminder.frequency === 'weekly') {
      trigger = {
        type: 'calendar',
        repeats: true,
        weekday: ((date.getDay() + 6) % 7) + 1,
        hour: date.getHours(),
        minute: date.getMinutes(),
      } as any;
    } else {
      // 'none'
      trigger = {
        type: 'calendar',
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        repeats: false,
      } as any;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger,
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string | null): Promise<void> {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();