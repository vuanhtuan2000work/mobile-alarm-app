/**
 * Update Alarm Use Case
 * Business logic for updating an existing alarm
 */

import { IAlarmRepository } from '../repositories/IAlarmRepository';
import { Alarm, UpdateAlarmDto } from '../entities/Alarm';
import { Result } from './CreateAlarm';

export class UpdateAlarmUseCase {
  constructor(private alarmRepository: IAlarmRepository) {}

  async execute(data: UpdateAlarmDto): Promise<Result<Alarm>> {
    try {
      // Validation
      if (data.hour !== undefined && (data.hour < 0 || data.hour > 23)) {
        return { success: false, error: 'Invalid hour. Must be between 0-23.' };
      }

      if (data.minute !== undefined && (data.minute < 0 || data.minute > 59)) {
        return { success: false, error: 'Invalid minute. Must be between 0-59.' };
      }

      // Check if alarm exists
      const existingAlarm = await this.alarmRepository.getById(data.id);
      if (!existingAlarm) {
        return { success: false, error: 'Alarm not found' };
      }

      // Update alarm
      const alarm = await this.alarmRepository.update(data);

      return { success: true, data: alarm };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update alarm',
      };
    }
  }
}