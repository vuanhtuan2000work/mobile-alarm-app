/**
 * Alarm Entity
 * Core business model representing an alarm
 */

export interface Alarm {
  id: string;
  label: string;
  hour: number; // 0-23
  minute: number; // 0-59
  enabled: boolean;
  repeatDays: RepeatDay[];
  soundId: string;
  vibrate: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export enum RepeatDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export interface CreateAlarmDto {
  label: string;
  hour: number;
  minute: number;
  repeatDays?: RepeatDay[];
  soundId?: string;
  vibrate?: boolean;
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
}

export interface UpdateAlarmDto {
  id: string;
  label?: string;
  hour?: number;
  minute?: number;
  enabled?: boolean;
  repeatDays?: RepeatDay[];
  soundId?: string;
  vibrate?: boolean;
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
}