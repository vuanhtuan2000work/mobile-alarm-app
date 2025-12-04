/**
 * Home Screen
 * Main screen displaying list of alarms
 */

import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
  Alert,
} from 'react-native';
import { HomeScreenProps } from '../navigation/types';
import { useAlarmStore } from '../store/useAlarmStore';
import { AlarmCard, EmptyState } from '../components';
import { AlarmViewModel } from '../viewmodels/AlarmViewModel';
import { AlarmRepository } from '@infrastructure/repositories/AlarmRepository';
import { NotificationService } from '@services/NotificationService';
import { AlarmScheduler } from '@services/AlarmScheduler';
import { COLORS } from '@utils/constants';

// Initialize dependencies
const alarmRepository = new AlarmRepository();
const notificationService = new NotificationService();
const alarmScheduler = new AlarmScheduler(alarmRepository, notificationService);
const alarmViewModel = new AlarmViewModel(alarmRepository, alarmScheduler);

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';
  const { alarms, loading } = useAlarmStore();

  useEffect(() => {
    loadAlarms();
    initializeNotifications();
  }, []);

  const loadAlarms = async (): Promise<void> => {
    await alarmViewModel.loadAlarms();
  };

  const initializeNotifications = async (): Promise<void> => {
    await notificationService.initialize();
    const granted = await notificationService.requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications to receive alarms.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleToggleAlarm = async (id: string, enabled: boolean): Promise<void> => {
    await alarmViewModel.toggleAlarm(id, enabled);
  };

  const handleEditAlarm = (alarm: any): void => {
    navigation.navigate('AddAlarm', { alarm });
  };

  const handleAddAlarm = (): void => {
    navigation.navigate('AddAlarm', {});
  };

  const handleSettings = (): void => {
    navigation.navigate('Settings');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlarmCard
            alarm={item}
            onToggle={handleToggleAlarm}
            onPress={() => handleEditAlarm(item)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          alarms.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={<EmptyState />}
        refreshing={loading}
        onRefresh={loadAlarms}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettings}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddAlarm}
          activeOpacity={0.8}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  settingsButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  settingsIcon: {
    fontSize: 24,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});