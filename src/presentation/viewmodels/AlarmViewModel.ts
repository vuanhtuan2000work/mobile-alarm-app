/**
 * Alarm ViewModel
 * Presentation logic for alarm operations
 */

import { CreateAlarmUseCase } from '@domain/usecases/CreateAlarm';
import { UpdateAlarmUseCase } from '@domain/usecases/UpdateAlarm';
import { DeleteAlarmUseCase } from '@domain/usecases/DeleteAlarm';
import { ToggleAlarmUseCase } from '@domain/usecases/ToggleAlarm';
import { IAlarmRepository } from '@domain/repositories/IAlarmRepository';
import { CreateAlarmDto, UpdateAlarmDto } from '@domain/entities/Alarm';
import { useAlarmStore } from '../store/useAlarmStore';
import { AlarmScheduler } from '@services/AlarmScheduler';

export class AlarmViewModel {
  private createAlarmUseCase: CreateAlarmUseCase;
  private updateAlarmUseCase: UpdateAlarmUseCase;
  private deleteAlarmUseCase: DeleteAlarmUseCase;
  private toggleAlarmUseCase: ToggleAlarmUseCase;
  
  constructor(
    private alarmRepository: IAlarmRepository,
    private alarmScheduler: AlarmScheduler
  ) {
    this.createAlarmUseCase = new CreateAlarmUseCase(alarmRepository);
    this.updateAlarmUseCase = new UpdateAlarmUseCase(alarmRepository);
    this.deleteAlarmUseCase = new DeleteAlarmUseCase(alarmRepository);
    this.toggleAlarmUseCase = new ToggleAlarmUseCase(alarmRepository);
  }

  async loadAlarms(): Promise<void> {
    const { setAlarms, setLoading, setError } = useAlarmStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const alarms = await this.alarmRepository.getAll();
      setAlarms(alarms);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load alarms');
    } finally {
      setLoading(false);
    }
  }

  async createAlarm(data: CreateAlarmDto): Promise<boolean> {
    const { addAlarm, setLoading, setError } = useAlarmStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await this.createAlarmUseCase.execute(data);
      
      if (result.success && result.data) {
        addAlarm(result.data);
        await this.alarmScheduler.scheduleAlarm(result.data);
        return true;
      } else {
        setError(result.error || 'Failed to create alarm');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create alarm');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async updateAlarm(data: UpdateAlarmDto): Promise<boolean> {
    const { updateAlarm, setLoading, setError } = useAlarmStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await this.updateAlarmUseCase.execute(data);
      
      if (result.success && result.data) {
        updateAlarm(result.data);
        await this.alarmScheduler.scheduleAlarm(result.data);
        return true;
      } else {
        setError(result.error || 'Failed to update alarm');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update alarm');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async deleteAlarm(id: string): Promise<boolean> {
    const { deleteAlarm, setLoading, setError } = useAlarmStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await this.deleteAlarmUseCase.execute(id);
      
      if (result.success) {
        deleteAlarm(id);
        await this.alarmScheduler.cancelAlarm(id);
        return true;
      } else {
        setError(result.error || 'Failed to delete alarm');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete alarm');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async toggleAlarm(id: string, enabled: boolean): Promise<boolean> {
    const { toggleAlarm, setLoading, setError } = useAlarmStore.getState();
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await this.toggleAlarmUseCase.execute(id, enabled);
      
      if (result.success && result.data) {
        toggleAlarm(id, enabled);
        
        if (enabled) {
          await this.alarmScheduler.scheduleAlarm(result.data);
        } else {
          await this.alarmScheduler.cancelAlarm(id);
        }
        
        return true;
      } else {
        setError(result.error || 'Failed to toggle alarm');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle alarm');
      return false;
    } finally {
      setLoading(false);
    }
  }
}