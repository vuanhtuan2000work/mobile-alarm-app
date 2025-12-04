/**
 * Mobile Alarm App
 * Main Application Component
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          🚨 Mobile Alarm App
        </Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#8E8E93' : '#8E8E93' }]}>
          React Native + Clean Architecture
        </Text>
        <Text style={[styles.version, { color: isDarkMode ? '#8E8E93' : '#8E8E93' }]}>
          Version 0.1.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
  },
});

export default App;