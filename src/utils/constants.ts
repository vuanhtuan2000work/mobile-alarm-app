/**
 * Application Constants
 */

export const APP_NAME = 'Mobile Alarm App';
export const APP_VERSION = '0.1.0';

export const DEFAULT_SNOOZE_DURATION = 5; // minutes
export const MAX_SNOOZE_COUNT = 3;

export const SOUND_IDS = {
  DEFAULT: 'default',
  BEEP: 'beep',
  CHIME: 'chime',
  RING: 'ring',
} as const;

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  error: '#FF3B30',
  success: '#34C759',
} as const;