/**
 * Add/Edit Alarm Screen
 * Screen for creating or editing an alarm
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  useColorScheme,
  Alert,
} from 'react-native';
import { AddAlarmScreenProps } from '../navigation/types';
import { Button, TimePickerModal } from '../components';
import { AlarmViewModel } from '../viewmodels/AlarmViewModel';
import { AlarmRepository } from '@infrastructure/repositories/AlarmRepository';
import { NotificationService } from '@services/NotificationService';
import { AlarmScheduler } from '@services/AlarmScheduler';
import { RepeatDay } from '@domain/entities/Alarm';
import { COLORS } from '@utils/constants';

const alarmRepository = new AlarmRepository();
const notificationService = new NotificationService();
const alarmScheduler = new AlarmScheduler(alarmRepository, notificationService);
const alarmViewModel = new AlarmViewModel(alarmRepository, alarmScheduler);

export const AddAlarmScreen: React.FC<AddAlarmScreenProps> = ({ navigation, route }) => {
  const isDark = useColorScheme() === 'dark';
  const existingAlarm = route.params?.alarm;
  const isEditing = !!existingAlarm;

  const [label, setLabel] = useState(existingAlarm?.label || '');
  const [hour, setHour] = useState(existingAlarm?.hour || 9);
  const [minute, setMinute] = useState(existingAlarm?.minute || 0);
  const [vibrate, setVibrate] = useState(existingAlarm?.vibrate ?? true);
  const [snoozeEnabled, setSnoozeEnabled] = useState(existingAlarm?.snoozeEnabled ?? true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatTime = (h: number, m: number): string => {
    const hour12 = h % 12 || 12;
    const minuteStr = m.toString().padStart(2, '0');
    const period = h < 12 ? 'AM' : 'PM';
    return `${hour12}:${minuteStr} ${period}`;
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    
    try {
      let success = false;
      
      if (isEditing && existingAlarm) {
        success = await alarmViewModel.updateAlarm({
          id: existingAlarm.id,
          label,
          hour,
          minute,
          vibrate,
          snoozeEnabled,
        });
      } else {
        success = await alarmViewModel.createAlarm({
          label,
          hour,
          minute,
          vibrate,
          snoozeEnabled,
          repeatDays: [],
        });
      }

      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save alarm');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!existingAlarm) return;

    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await alarmViewModel.deleteAlarm(existingAlarm.id);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete alarm');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={styles.content}>
      
      {/* Time Display */}
      <View style={styles.section}>
        <Text style={[styles.timeDisplay, isDark && styles.timeDisplayDark]}>
          {formatTime(hour, minute)}
        </Text>
        <Button
          title="Change Time"
          onPress={() => setShowTimePicker(true)}
          variant="secondary"
        />
      </View>

      {/* Label */}
      <View style={styles.section}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Label</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={label}
          onChangeText={setLabel}
          placeholder="Alarm name"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {/* Options */}
      <View style={styles.section}>
        <View style={styles.option}>
          <Text style={[styles.optionLabel, isDark && styles.optionLabelDark]}>Vibrate</Text>
          <Switch
            value={vibrate}
            onValueChange={setVibrate}
            trackColor={{ false: '#767577', true: COLORS.primary }}
          />
        </View>

        <View style={styles.option}>
          <Text style={[styles.optionLabel, isDark && styles.optionLabelDark]}>Snooze</Text>
          <Switch
            value={snoozeEnabled}
            onValueChange={setSnoozeEnabled}
            trackColor={{ false: '#767577', true: COLORS.primary }}
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Button
          title={isEditing ? 'Update Alarm' : 'Create Alarm'}
          onPress={handleSave}
          loading={loading}
        />
        
        {isEditing && (
          <Button
            title="Delete Alarm"
            onPress={handleDelete}
            variant="danger"
            style={styles.deleteButton}
          />
        )}
      </View>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        initialHour={hour}
        initialMinute={minute}
        onConfirm={(h, m) => {
          setHour(h);
          setMinute(m);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />
    </ScrollView>
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
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  timeDisplay: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  timeDisplayDark: {
    color: COLORS.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputDark: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    borderColor: '#38383A',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionLabel: {
    fontSize: 16,
    color: '#000000',
  },
  optionLabelDark: {
    color: '#FFFFFF',
  },
  buttons: {
    marginTop: 16,
  },
  deleteButton: {
    marginTop: 12,
  },
});