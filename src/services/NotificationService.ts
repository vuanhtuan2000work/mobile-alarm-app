/**
 * Notification Service
 * Handles scheduling and managing alarm notifications
 */

import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import { Alarm } from '@domain/entities/Alarm';

export class NotificationService {
  private static CHANNEL_ID = 'alarm-channel';

  async initialize(): Promise<void> {
    await this.createChannel();
  }

  private async createChannel(): Promise<void> {
    await notifee.createChannel({
      id: NotificationService.CHANNEL_ID,
      name: 'Alarms',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  }

  async scheduleAlarm(alarm: Alarm): Promise<void> {
    const trigger = this.calculateTrigger(alarm);

    await notifee.createTriggerNotification(
      {
        id: alarm.id,
        title: alarm.label || 'Alarm',
        body: `${this.formatTime(alarm.hour, alarm.minute)}`,
        android: {
          channelId: NotificationService.CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          sound: alarm.soundId,
          vibrationPattern: alarm.vibrate ? [300, 500] : undefined,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: alarm.soundId,
          critical: true,
          criticalVolume: 1.0,
        },
      },
      trigger
    );
  }

  async cancelAlarm(alarmId: string): Promise<void> {
    await notifee.cancelNotification(alarmId);
  }

  async requestPermissions(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  }

  private calculateTrigger(alarm: Alarm) {
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(alarm.hour, alarm.minute, 0, 0);

    // If alarm time has passed today, schedule for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    return {
      type: TriggerType.TIMESTAMP,
      timestamp: alarmTime.getTime(),
      repeatFrequency: alarm.repeatDays.length > 0 ? 'daily' : undefined,
    };
  }

  private formatTime(hour: number, minute: number): string {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    return `${h}:${m} ${period}`;
  }
}