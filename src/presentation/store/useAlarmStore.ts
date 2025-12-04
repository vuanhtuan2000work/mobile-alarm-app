/**
 * Alarm Store
 * Global state management using Zustand
 */

import { create } from 'zustand';
import { Alarm } from '@domain/entities/Alarm';

interface AlarmStore {
  alarms: Alarm[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setAlarms: (alarms: Alarm[]) => void;
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (alarm: Alarm) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string, enabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [],
  loading: false,
  error: null,

  setAlarms: (alarms) => set({ alarms }),
  
  addAlarm: (alarm) =>
    set((state) => ({ alarms: [...state.alarms, alarm] })),
  
  updateAlarm: (updatedAlarm) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === updatedAlarm.id ? updatedAlarm : alarm
      ),
    })),
  
  deleteAlarm: (id) =>
    set((state) => ({
      alarms: state.alarms.filter((alarm) => alarm.id !== id),
    })),
  
  toggleAlarm: (id, enabled) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled } : alarm
      ),
    })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));