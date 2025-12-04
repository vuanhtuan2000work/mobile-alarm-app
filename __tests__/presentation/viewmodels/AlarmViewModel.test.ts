/**
 * AlarmViewModel Unit Tests
 */

import { AlarmViewModel } from '@presentation/viewmodels/AlarmViewModel';
import { IAlarmRepository } from '@domain/repositories/IAlarmRepository';
import { AlarmScheduler } from '@services/AlarmScheduler';
import { useAlarmStore } from '@presentation/store/useAlarmStore';
import { Alarm, RepeatDay } from '@domain/entities/Alarm';

jest.mock('@presentation/store/useAlarmStore');

const createMockRepository = (): jest.Mocked<IAlarmRepository> => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  toggleEnabled: jest.fn(),
});

const createMockScheduler = (): jest.Mocked<AlarmScheduler> =>
  ({
    scheduleAlarm: jest.fn(),
    cancelAlarm: jest.fn(),
    rescheduleAll: jest.fn(),
  } as any);

describe('AlarmViewModel', () => {
  let repository: jest.Mocked<IAlarmRepository>;
  let scheduler: jest.Mocked<AlarmScheduler>;
  let viewModel: AlarmViewModel;
  let mockStore: any;

  const mockAlarm: Alarm = {
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
    scheduler = createMockScheduler();
    viewModel = new AlarmViewModel(repository, scheduler);

    mockStore = {
      setAlarms: jest.fn(),
      addAlarm: jest.fn(),
      updateAlarm: jest.fn(),
      deleteAlarm: jest.fn(),
      toggleAlarm: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
    };

    (useAlarmStore.getState as jest.Mock) = jest.fn(() => mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadAlarms', () => {
    it('should load alarms and update store', async () => {
      const alarms = [mockAlarm];
      repository.getAll.mockResolvedValue(alarms);

      await viewModel.loadAlarms();

      expect(mockStore.setLoading).toHaveBeenCalledWith(true);
      expect(repository.getAll).toHaveBeenCalled();
      expect(mockStore.setAlarms).toHaveBeenCalledWith(alarms);
      expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    });

    it('should set error when loading fails', async () => {
      repository.getAll.mockRejectedValue(new Error('Load failed'));

      await viewModel.loadAlarms();

      expect(mockStore.setError).toHaveBeenCalledWith('Load failed');
      expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('createAlarm', () => {
    it('should create alarm and schedule notification', async () => {
      repository.create.mockResolvedValue(mockAlarm);
      scheduler.scheduleAlarm.mockResolvedValue(undefined);

      const success = await viewModel.createAlarm({
        label: 'Morning',
        hour: 7,
        minute: 30,
      });

      expect(success).toBe(true);
      expect(mockStore.addAlarm).toHaveBeenCalledWith(mockAlarm);
      expect(scheduler.scheduleAlarm).toHaveBeenCalledWith(mockAlarm);
    });

    it('should not schedule when creation fails', async () => {
      repository.create.mockRejectedValue(new Error('Create failed'));

      const success = await viewModel.createAlarm({
        label: 'Test',
        hour: 7,
        minute: 30,
      });

      expect(success).toBe(false);
      expect(scheduler.scheduleAlarm).not.toHaveBeenCalled();
      expect(mockStore.setError).toHaveBeenCalledWith('Create failed');
    });
  });

  describe('updateAlarm', () => {
    it('should update alarm and reschedule', async () => {
      const updatedAlarm = { ...mockAlarm, hour: 8 };
      repository.getById.mockResolvedValue(mockAlarm);
      repository.update.mockResolvedValue(updatedAlarm);

      const success = await viewModel.updateAlarm({
        id: 'alarm_123',
        hour: 8,
      });

      expect(success).toBe(true);
      expect(mockStore.updateAlarm).toHaveBeenCalledWith(updatedAlarm);
      expect(scheduler.scheduleAlarm).toHaveBeenCalledWith(updatedAlarm);
    });
  });

  describe('deleteAlarm', () => {
    it('should delete alarm and cancel notification', async () => {
      repository.getById.mockResolvedValue(mockAlarm);
      repository.delete.mockResolvedValue(undefined);

      const success = await viewModel.deleteAlarm('alarm_123');

      expect(success).toBe(true);
      expect(mockStore.deleteAlarm).toHaveBeenCalledWith('alarm_123');
      expect(scheduler.cancelAlarm).toHaveBeenCalledWith('alarm_123');
    });
  });

  describe('toggleAlarm', () => {
    it('should enable alarm and schedule notification', async () => {
      const enabledAlarm = { ...mockAlarm, enabled: true };
      repository.getById.mockResolvedValue({ ...mockAlarm, enabled: false });
      repository.toggleEnabled.mockResolvedValue(enabledAlarm);

      const success = await viewModel.toggleAlarm('alarm_123', true);

      expect(success).toBe(true);
      expect(mockStore.toggleAlarm).toHaveBeenCalledWith('alarm_123', true);
      expect(scheduler.scheduleAlarm).toHaveBeenCalledWith(enabledAlarm);
    });

    it('should disable alarm and cancel notification', async () => {
      const disabledAlarm = { ...mockAlarm, enabled: false };
      repository.getById.mockResolvedValue(mockAlarm);
      repository.toggleEnabled.mockResolvedValue(disabledAlarm);

      const success = await viewModel.toggleAlarm('alarm_123', false);

      expect(success).toBe(true);
      expect(mockStore.toggleAlarm).toHaveBeenCalledWith('alarm_123', false);
      expect(scheduler.cancelAlarm).toHaveBeenCalledWith('alarm_123');
    });
  });
});