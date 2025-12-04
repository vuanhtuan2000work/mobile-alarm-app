/**
 * Navigation Types
 * Type definitions for React Navigation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alarm } from '@domain/entities/Alarm';

export type RootStackParamList = {
  Home: undefined;
  AddAlarm: { alarm?: Alarm };
  Settings: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type AddAlarmScreenProps = NativeStackScreenProps<RootStackParamList, 'AddAlarm'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;