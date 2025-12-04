/**
 * Empty State Component
 * Displays when no alarms exist
 */

import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { COLORS } from '@utils/constants';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No alarms yet',
}) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⏰</Text>
      <Text style={[styles.message, isDark && styles.messageDark]}>{message}</Text>
      <Text style={[styles.hint, isDark && styles.hintDark]}>
        Tap + to create your first alarm
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  messageDark: {
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  hintDark: {
    color: '#8E8E93',
  },
});