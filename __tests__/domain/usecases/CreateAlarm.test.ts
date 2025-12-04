/**
 * CreateAlarmUseCase Unit Tests
 */

import { CreateAlarmUseCase } from '@domain/usecases/CreateAlarm';
import { IAlarmRepository } from '@domain/repositories/IAlarmRepository';
import { Alarm, RepeatDay } from '@domain/entities/Alarm';

// Mock Repository
const createMockRepository = (): jest.Mocked<IAlarmRepository> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  toggleEnabled: jest.fn(),
});

describe('CreateAlarmUseCase', () => {
  let repository: jest.Mocked<IAlarmRepository>;
  let useCase: CreateAlarmUseCase;

  beforeEach(() => {
    repository = createMockRepository();
    useCase = new CreateAlarmUseCase(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should create alarm with valid data', async () => {
      const mockAlarm: Alarm = {
        id: 'alarm_123',
        label: 'Morning Alarm',
        hour: 7,
        minute: 30,
        enabled: true,
        repeatDays: [RepeatDay.MONDAY, RepeatDay.WEDNESDAY],
        soundId: 'default',
        vibrate: true,
        snoozeEnabled: true,
        snoozeDuration: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockResolvedValue(mockAlarm);

      const result = await useCase.execute({
        label: 'Morning Alarm',
        hour: 7,
        minute: 30,
        repeatDays: [RepeatDay.MONDAY, RepeatDay.WEDNESDAY],
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAlarm);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({
        label: 'Morning Alarm',
        hour: 7,
        minute: 30,
        repeatDays: [RepeatDay.MONDAY, RepeatDay.WEDNESDAY],
      });
    });

    it('should create alarm with minimum required fields', async () => {
      const mockAlarm: Alarm = {
        id: 'alarm_456',
        label: 'Test',
        hour: 0,
        minute: 0,
        enabled: true,
        repeatDays: [],
        soundId: 'default',
        vibrate: true,
        snoozeEnabled: true,
        snoozeDuration: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockResolvedValue(mockAlarm);

      const result = await useCase.execute({
        label: 'Test',
        hour: 0,
        minute: 0,
      });

      expect(result.success).toBe(true);
      expect(result.data?.hour).toBe(0);
      expect(result.data?.minute).toBe(0);
    });
  });

  describe('Validation Errors', () => {
    it('should fail when hour is less than 0', async () => {
      const result = await useCase.execute({
        label: 'Invalid',
        hour: -1,
        minute: 30,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid hour. Must be between 0-23.');
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should fail when hour is greater than 23', async () => {
      const result = await useCase.execute({
        label: 'Invalid',
        hour: 24,
        minute: 30,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid hour. Must be between 0-23.');
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should fail when minute is less than 0', async () => {
      const result = await useCase.execute({
        label: 'Invalid',
        hour: 10,
        minute: -1,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid minute. Must be between 0-59.');
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should fail when minute is greater than 59', async () => {
      const result = await useCase.execute({
        label: 'Invalid',
        hour: 10,
        minute: 60,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid minute. Must be between 0-59.');
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('Repository Errors', () => {
    it('should handle repository errors gracefully', async () => {
      repository.create.mockRejectedValue(new Error('Database error'));

      const result = await useCase.execute({
        label: 'Test',
        hour: 10,
        minute: 30,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });

    it('should handle unknown errors', async () => {
      repository.create.mockRejectedValue('Unknown error');

      const result = await useCase.execute({
        label: 'Test',
        hour: 10,
        minute: 30,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create alarm');
    });
  });
});