/**
 * DeleteAlarmUseCase Unit Tests
 */

import { DeleteAlarmUseCase } from '@domain/usecases/DeleteAlarm';
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

describe('DeleteAlarmUseCase', () => {
  let repository: jest.Mocked<IAlarmRepository>;
  let useCase: DeleteAlarmUseCase;

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
    useCase = new DeleteAlarmUseCase(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should delete existing alarm', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.delete.mockResolvedValue(undefined);

      const result = await useCase.execute('alarm_123');

      expect(result.success).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith('alarm_123');
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Cases', () => {
    it('should fail when alarm not found', async () => {
      repository.getById.mockResolvedValue(null);

      const result = await useCase.execute('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Alarm not found');
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      repository.getById.mockResolvedValue(existingAlarm);
      repository.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await useCase.execute('alarm_123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Delete failed');
    });
  });
});