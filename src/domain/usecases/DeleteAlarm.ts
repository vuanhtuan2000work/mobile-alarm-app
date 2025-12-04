/**
 * Delete Alarm Use Case
 * Business logic for deleting an alarm
 */

import { IAlarmRepository } from '../repositories/IAlarmRepository';
import { Result } from './CreateAlarm';

export class DeleteAlarmUseCase {
  constructor(private alarmRepository: IAlarmRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      // Check if alarm exists
      const existingAlarm = await this.alarmRepository.getById(id);
      if (!existingAlarm) {
        return { success: false, error: 'Alarm not found' };
      }

      // Delete alarm
      await this.alarmRepository.delete(id);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete alarm',
      };
    }
  }
}