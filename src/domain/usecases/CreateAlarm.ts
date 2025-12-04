/**
 * Create Alarm Use Case
 * Business logic for creating a new alarm
 */

import { IAlarmRepository } from '../repositories/IAlarmRepository';
import { Alarm, CreateAlarmDto } from '../entities/Alarm';

export class CreateAlarmUseCase {
  constructor(private alarmRepository: IAlarmRepository) {}

  async execute(data: CreateAlarmDto): Promise<Result<Alarm>> {
    try {
      // Validation
      if (data.hour < 0 || data.hour > 23) {
        return { success: false, error: 'Invalid hour. Must be between 0-23.' };
      }

      if (data.minute < 0 || data.minute > 59) {
        return { success: false, error: 'Invalid minute. Must be between 0-59.' };
      }

      // Create alarm
      const alarm = await this.alarmRepository.create(data);

      return { success: true, data: alarm };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create alarm',
      };
    }
  }
}

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}