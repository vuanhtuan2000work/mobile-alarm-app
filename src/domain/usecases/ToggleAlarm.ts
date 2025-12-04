/**
 * Toggle Alarm Use Case
 * Business logic for enabling/disabling an alarm
 */

import { IAlarmRepository } from '../repositories/IAlarmRepository';
import { Alarm } from '../entities/Alarm';
import { Result } from './CreateAlarm';

export class ToggleAlarmUseCase {
  constructor(private alarmRepository: IAlarmRepository) {}

  async execute(id: string, enabled: boolean): Promise<Result<Alarm>> {
    try {
      // Check if alarm exists
      const existingAlarm = await this.alarmRepository.getById(id);
      if (!existingAlarm) {
        return { success: false, error: 'Alarm not found' };
      }

      // Toggle alarm
      const alarm = await this.alarmRepository.toggleEnabled(id, enabled);

      return { success: true, data: alarm };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle alarm',
      };
    }
  }
}