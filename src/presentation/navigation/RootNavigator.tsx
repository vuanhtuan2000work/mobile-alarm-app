/**
 * Root Navigator
 * Main navigation structure
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { AddAlarmScreen } from '../screens/AddAlarmScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS } from '@utils/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Alarms' }}
      />
      <Stack.Screen
        name="AddAlarm"
        component={AddAlarmScreen}
        options={({ route }) => ({
          title: route.params?.alarm ? 'Edit Alarm' : 'Add Alarm',
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};