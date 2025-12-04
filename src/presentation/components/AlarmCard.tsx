/**
 * Alarm Card Component
 * Displays individual alarm information
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Alarm, RepeatDay } from '@domain/entities/Alarm';
import { COLORS } from '@utils/constants';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string, enabled: boolean) => void;
  onPress: () => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onToggle, onPress }) => {
  const isDark = useColorScheme() === 'dark';
  
  const formatTime = (hour: number, minute: number): string => {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    return `${h}:${m} ${period}`;
  };

  const getRepeatDaysText = (days: RepeatDay[]): string => {
    if (days.length === 0) return 'One time';
    if (days.length === 7) return 'Every day';
    
    const weekdays = [RepeatDay.MONDAY, RepeatDay.TUESDAY, RepeatDay.WEDNESDAY, RepeatDay.THURSDAY, RepeatDay.FRIDAY];
    const weekends = [RepeatDay.SATURDAY, RepeatDay.SUNDAY];
    
    if (days.length === 5 && weekdays.every(d => days.includes(d))) {
      return 'Weekdays';
    }
    if (days.length === 2 && weekends.every(d => days.includes(d))) {
      return 'Weekends';
    }
    
    return days.map(d => d.substring(0, 3)).join(', ');
  };

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={[styles.time, isDark && styles.timeDark, !alarm.enabled && styles.disabled]}>
            {formatTime(alarm.hour, alarm.minute)}
          </Text>
          <Text style={[styles.label, isDark && styles.labelDark, !alarm.enabled && styles.disabled]}>
            {alarm.label || 'Alarm'}
          </Text>
          <Text style={[styles.repeat, isDark && styles.repeatDark]}>
            {getRepeatDaysText(alarm.repeatDays)}
          </Text>
        </View>
        
        <Switch
          value={alarm.enabled}
          onValueChange={(value) => onToggle(alarm.id, value)}
          trackColor={{ false: '#767577', true: COLORS.primary }}
          thumbColor={alarm.enabled ? '#FFFFFF' : '#f4f3f4'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  time: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  timeDark: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  repeat: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  repeatDark: {
    color: '#8E8E93',
  },
  disabled: {
    opacity: 0.5,
  },
});