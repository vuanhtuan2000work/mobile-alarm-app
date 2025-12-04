/**
 * UpdateAlarmUseCase Unit Tests
 */

import { UpdateAlarmUseCase } from '@domain/usecases/UpdateAlarm';
import { IAlarmRepository } from '@domain/repositories/IAlarmRepository';
import { Alarm, RepeatDay } from '@domain/entities/Alarm';

const createMockRepository = (): jest.Mocked<IAlarmRepository> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  toggleEnabled: jest.fn(),
});

describe('UpdateAlarmUseCase', () => {
  let repository: jest.Mocked<IAlarmRepository>;
  let useCase: UpdateAlarmUseCase;

  const existingAlarm: Alarm = {
    id: 'alarm_123',
    label: 'Morning',
    hour: 7,
    minute: 30,
    enabled: true,
    repeatDays: [],
    soundId: 'default',
    vibrate: true,
    snoozeEnabled: true,
    snoozeDuration: 5,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    repository = createMockRepository();
    useCase = new UpdateAlarmUseCase(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should update alarm label', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.update.mockResolvedValue({
        ...existingAlarm,
        label: 'Evening',
        updatedAt: new Date(),
      });

      const result = await useCase.execute({
        id: 'alarm_123',
        label: 'Evening',
      });

      expect(result.success).toBe(true);
      expect(result.data?.label).toBe('Evening');
      expect(repository.update).toHaveBeenCalledWith({
        id: 'alarm_123',
        label: 'Evening',
      });
    });

    it('should update alarm time', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.update.mockResolvedValue({
        ...existingAlarm,
        hour: 9,
        minute: 15,
        updatedAt: new Date(),
      });

      const result = await useCase.execute({
        id: 'alarm_123',
        hour: 9,
        minute: 15,
      });

      expect(result.success).toBe(true);
      expect(result.data?.hour).toBe(9);
      expect(result.data?.minute).toBe(15);
    });

    it('should update multiple fields', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.update.mockResolvedValue({
        ...existingAlarm,
        label: 'Work Alarm',
        hour: 8,
        minute: 0,
        vibrate: false,
        updatedAt: new Date(),
      });

      const result = await useCase.execute({
        id: 'alarm_123',
        label: 'Work Alarm',
        hour: 8,
        minute: 0,
        vibrate: false,
      });

      expect(result.success).toBe(true);
      expect(result.data?.label).toBe('Work Alarm');
      expect(result.data?.vibrate).toBe(false);
    });
  });

  describe('Validation Errors', () => {
    it('should fail when alarm not found', async () => {
      repository.getById.mockResolvedValue(null);

      const result = await useCase.execute({
        id: 'nonexistent',
        label: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Alarm not found');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should fail when hour is invalid', async () => {
      repository.getById.mockResolvedValue(existingAlarm);

      const result = await useCase.execute({
        id: 'alarm_123',
        hour: 25,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid hour. Must be between 0-23.');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should fail when minute is invalid', async () => {
      repository.getById.mockResolvedValue(existingAlarm);

      const result = await useCase.execute({
        id: 'alarm_123',
        minute: 70,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid minute. Must be between 0-59.');
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('Repository Errors', () => {
    it('should handle update errors', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.update.mockRejectedValue(new Error('Update failed'));

      const result = await useCase.execute({
        id: 'alarm_123',
        label: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Update failed');
    });
  });
});