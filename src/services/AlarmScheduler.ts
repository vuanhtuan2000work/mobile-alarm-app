/**
 * Alarm Scheduler Service
 * Coordinates alarm scheduling between repository and notification service
 */

import { IAlarmRepository } from '@domain/repositories/IAlarmRepository';
import { NotificationService } from './NotificationService';
import { Alarm } from '@domain/entities/Alarm';

export class AlarmScheduler {
  constructor(
    private alarmRepository: IAlarmRepository,
    private notificationService: NotificationService
  ) {}

  async scheduleAlarm(alarm: Alarm): Promise<void> {
    if (!alarm.enabled) {
      await this.cancelAlarm(alarm.id);
      return;
    }

    await this.notificationService.scheduleAlarm(alarm);
  }

  async cancelAlarm(alarmId: string): Promise<void> {
    await this.notificationService.cancelAlarm(alarmId);
  }

  async rescheduleAll(): Promise<void> {
    const alarms = await this.alarmRepository.getAll();
    
    for (const alarm of alarms) {
      if (alarm.enabled) {
        await this.scheduleAlarm(alarm);
      }
    }
  }
}