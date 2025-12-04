/**
 * Settings Screen
 * App settings and preferences
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Linking,
} from 'react-native';
import { SettingsScreenProps } from '../navigation/types';
import { APP_NAME, APP_VERSION, COLORS } from '@utils/constants';

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const isDark = useColorScheme() === 'dark';

  const handleOpenGitHub = (): void => {
    Linking.openURL('https://github.com/vuanhtuan2000work/mobile-alarm-app');
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={styles.content}>
      
      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <Text style={styles.appIcon}>🚨</Text>
          <Text style={[styles.appName, isDark && styles.appNameDark]}>{APP_NAME}</Text>
          <Text style={[styles.version, isDark && styles.versionDark]}>Version {APP_VERSION}</Text>
        </View>
      </View>

      {/* Settings Options */}
      <View style={[styles.section, styles.card, isDark && styles.cardDark]}>
        <TouchableOpacity style={styles.option}>
          <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Notifications</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Sound & Vibration</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Language</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={[styles.section, styles.card, isDark && styles.cardDark]}>
        <TouchableOpacity style={styles.option} onPress={handleOpenGitHub}>
          <Text style={[styles.optionText, isDark && styles.optionTextDark]}>GitHub Repository</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Privacy Policy</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Terms of Service</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
          Built with React Native & Clean Architecture
        </Text>
        <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
          © 2025 Mobile Alarm App
        </Text>
      </View>
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
    marginBottom: 24,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  appNameDark: {
    color: '#FFFFFF',
  },
  version: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  versionDark: {
    color: '#8E8E93',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
  optionTextDark: {
    color: '#FFFFFF',
  },
  arrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footerTextDark: {
    color: '#8E8E93',
  },
});