/**
 * AlarmRepository Unit Tests
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlarmRepository } from '@infrastructure/repositories/AlarmRepository';
import { Alarm, RepeatDay } from '@domain/entities/Alarm';

jest.mock('@react-native-async-storage/async-storage');

const STORAGE_KEY = '@mobile-alarm-app:alarms';

describe('AlarmRepository', () => {
  let repository: AlarmRepository;

  const mockAlarm: Alarm = {
    id: 'alarm_123',
    label: 'Morning',
    hour: 7,
    minute: 30,
    enabled: true,
    repeatDays: [RepeatDay.MONDAY],
    soundId: 'default',
    vibrate: true,
    snoozeEnabled: true,
    snoozeDuration: 5,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    repository = new AlarmRepository();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return empty array when no alarms stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await repository.getAll();

      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return stored alarms', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockAlarm]));

      const result = await repository.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('alarm_123');
    });

    it('should handle storage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await repository.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return alarm when found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockAlarm]));

      const result = await repository.getById('alarm_123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('alarm_123');
    });

    it('should return null when not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockAlarm]));

      const result = await repository.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and store new alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await repository.create({
        label: 'Morning',
        hour: 7,
        minute: 30,
      });

      expect(result.label).toBe('Morning');
      expect(result.hour).toBe(7);
      expect(result.minute).toBe(30);
      expect(result.enabled).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should generate unique ID', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const alarm1 = await repository.create({ label: 'Test1', hour: 7, minute: 0 });
      const alarm2 = await repository.create({ label: 'Test2', hour: 8, minute: 0 });

      expect(alarm1.id).not.toBe(alarm2.id);
    });
  });

  describe('update', () => {
    it('should update existing alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockAlarm]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await repository.update({
        id: 'alarm_123',
        label: 'Updated',
      });

      expect(result.label).toBe('Updated');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should throw when alarm not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockAlarm]));

      await expect(
        repository.update({ id: 'nonexistent', label: 'Test' })
      ).rejects.toThrow('Alarm not found');
    });
  });

  describe('delete', () => {
    it('should delete alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockAlarm]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await repository.delete('alarm_123');

      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const alarms = JSON.parse(savedData);
      expect(alarms).toHaveLength(0);
    });
  });

  describe('toggleEnabled', () => {
    it('should toggle alarm enabled state', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockAlarm]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await repository.toggleEnabled('alarm_123', false);

      expect(result.enabled).toBe(false);
    });
  });
});