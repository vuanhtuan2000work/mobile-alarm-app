/**
 * Alarm Repository Interface
 * Defines contract for alarm data operations
 */

import { Alarm, CreateAlarmDto, UpdateAlarmDto } from '../entities/Alarm';

export interface IAlarmRepository {
  /**
   * Get all alarms
   */
  getAll(): Promise<Alarm[]>;

  /**
   * Get alarm by ID
   */
  getById(id: string): Promise<Alarm | null>;

  /**
   * Create new alarm
   */
  create(data: CreateAlarmDto): Promise<Alarm>;

  /**
   * Update existing alarm
   */
  update(data: UpdateAlarmDto): Promise<Alarm>;

  /**
   * Delete alarm by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Toggle alarm enabled/disabled
   */
  toggleEnabled(id: string, enabled: boolean): Promise<Alarm>;
}