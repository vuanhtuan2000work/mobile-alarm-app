/**
 * Jest Setup File
 * Global test configuration and mocks
 */

import '@testing-library/jest-native/extend-expect';

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Notifee
jest.mock('@notifee/react-native', () => ({
  createChannel: jest.fn(),
  displayNotification: jest.fn(),
  createTriggerNotification: jest.fn(),
  cancelNotification: jest.fn(),
  requestPermission: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
  TriggerType: {
    TIMESTAMP: 0,
  },
  AndroidImportance: {
    HIGH: 4,
  },
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock Zustand
jest.mock('zustand');

// Silence console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock Date for consistent testing
const MOCK_DATE = new Date('2025-01-01T00:00:00.000Z');
global.Date = class extends Date {
  constructor(date?: any) {
    if (date) {
      super(date);
    } else {
      super(MOCK_DATE);
    }
  }
} as any;