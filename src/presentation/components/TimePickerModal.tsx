/**
 * Time Picker Modal Component
 * Modal for selecting alarm time
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { COLORS } from '@utils/constants';

interface TimePickerModalProps {
  visible: boolean;
  initialHour?: number;
  initialMinute?: number;
  onConfirm: (hour: number, minute: number) => void;
  onCancel: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initialHour = 9,
  initialMinute = 0,
  onConfirm,
  onCancel,
}) => {
  const isDark = useColorScheme() === 'dark';
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  const handleConfirm = (): void => {
    onConfirm(hour, minute);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.container, isDark && styles.containerDark]}>
          <Text style={[styles.title, isDark && styles.titleDark]}>Set Alarm Time</Text>
          
          <View style={styles.timeDisplay}>
            <Text style={[styles.timeText, isDark && styles.timeTextDark]}>
              {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
            </Text>
          </View>

          {/* Simple hour/minute selectors */}
          <View style={styles.pickerContainer}>
            <View style={styles.picker}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Hour</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>{hour}</Text>
            </View>
            <View style={styles.picker}>
              <Text style={[styles.label, isDark && styles.labelDark]}>Minute</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>{minute}</Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timeTextDark: {
    color: COLORS.primary,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  picker: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  labelDark: {
    color: '#8E8E93',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  valueDark: {
    color: '#FFFFFF',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});