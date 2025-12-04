/**
 * ToggleAlarmUseCase Unit Tests
 */

import { ToggleAlarmUseCase } from '@domain/usecases/ToggleAlarm';
import { IAlarmRepository } from '@domain/repositories/IAlarmRepository';
import { Alarm } from '@domain/entities/Alarm';

const createMockRepository = (): jest.Mocked<IAlarmRepository> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  toggleEnabled: jest.fn(),
});

describe('ToggleAlarmUseCase', () => {
  let repository: jest.Mocked<IAlarmRepository>;
  let useCase: ToggleAlarmUseCase;

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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = createMockRepository();
    useCase = new ToggleAlarmUseCase(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should enable disabled alarm', async () => {
      const disabledAlarm = { ...existingAlarm, enabled: false };
      repository.getById.mockResolvedValue(disabledAlarm);
      repository.toggleEnabled.mockResolvedValue({ ...disabledAlarm, enabled: true });

      const result = await useCase.execute('alarm_123', true);

      expect(result.success).toBe(true);
      expect(result.data?.enabled).toBe(true);
      expect(repository.toggleEnabled).toHaveBeenCalledWith('alarm_123', true);
    });

    it('should disable enabled alarm', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.toggleEnabled.mockResolvedValue({ ...existingAlarm, enabled: false });

      const result = await useCase.execute('alarm_123', false);

      expect(result.success).toBe(true);
      expect(result.data?.enabled).toBe(false);
      expect(repository.toggleEnabled).toHaveBeenCalledWith('alarm_123', false);
    });
  });

  describe('Error Cases', () => {
    it('should fail when alarm not found', async () => {
      repository.getById.mockResolvedValue(null);

      const result = await useCase.execute('nonexistent', true);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Alarm not found');
      expect(repository.toggleEnabled).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.toggleEnabled.mockRejectedValue(new Error('Toggle failed'));

      const result = await useCase.execute('alarm_123', false);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Toggle failed');
    });
  });
});