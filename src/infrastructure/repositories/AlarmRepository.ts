/**
 * Alarm Repository Implementation
 * Handles alarm data persistence using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAlarmRepository } from '@domain/repositories/IAlarmRepository';
import { Alarm, CreateAlarmDto, UpdateAlarmDto, RepeatDay } from '@domain/entities/Alarm';

const STORAGE_KEY = '@mobile-alarm-app:alarms';

export class AlarmRepository implements IAlarmRepository {
  async getAll(): Promise<Alarm[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to get alarms:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Alarm | null> {
    const alarms = await this.getAll();
    return alarms.find(alarm => alarm.id === id) || null;
  }

  async create(data: CreateAlarmDto): Promise<Alarm> {
    const alarms = await this.getAll();
    
    const newAlarm: Alarm = {
      id: this.generateId(),
      label: data.label,
      hour: data.hour,
      minute: data.minute,
      enabled: true,
      repeatDays: data.repeatDays || [],
      soundId: data.soundId || 'default',
      vibrate: data.vibrate ?? true,
      snoozeEnabled: data.snoozeEnabled ?? true,
      snoozeDuration: data.snoozeDuration || 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    alarms.push(newAlarm);
    await this.saveAll(alarms);
    
    return newAlarm;
  }

  async update(data: UpdateAlarmDto): Promise<Alarm> {
    const alarms = await this.getAll();
    const index = alarms.findIndex(alarm => alarm.id === data.id);
    
    if (index === -1) {
      throw new Error('Alarm not found');
    }

    const updatedAlarm: Alarm = {
      ...alarms[index],
      ...data,
      updatedAt: new Date(),
    };

    alarms[index] = updatedAlarm;
    await this.saveAll(alarms);
    
    return updatedAlarm;
  }

  async delete(id: string): Promise<void> {
    const alarms = await this.getAll();
    const filtered = alarms.filter(alarm => alarm.id !== id);
    await this.saveAll(filtered);
  }

  async toggleEnabled(id: string, enabled: boolean): Promise<Alarm> {
    return this.update({ id, enabled });
  }

  private async saveAll(alarms: Alarm[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }

  private generateId(): string {
    return `alarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}