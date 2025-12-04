# Edge Cases & Solutions

Documentation of complex edge cases and their solutions in Mobile Alarm App.

---

## ⏰ Time-Related Edge Cases

### 1. Daylight Saving Time (DST) Transitions

**Problem:**
When clocks "spring forward" or "fall back", scheduled alarms may fire at unexpected times.

**Example:**
- Alarm set for 2:30 AM
- DST begins at 2:00 AM (clocks jump to 3:00 AM)
- Result: 2:30 AM doesn't exist!

**Solution:**
```typescript
// AlarmScheduler.ts
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

function scheduleNextAlarm(alarm: Alarm) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  
  // Create next alarm time in local timezone
  let nextAlarm = new Date();
  nextAlarm.setHours(alarm.hour, alarm.minute, 0, 0);
  
  // If time has passed today, schedule for tomorrow
  if (nextAlarm <= now) {
    nextAlarm = addDays(nextAlarm, 1);
  }
  
  // Convert to UTC to avoid DST issues
  const utcTime = zonedTimeToUtc(nextAlarm, timezone);
  
  // Schedule using UTC timestamp
  await NotificationService.schedule(alarm.id, utcTime);
}
```

**Test Case:**
```typescript
it('should handle DST transition correctly', () => {
  // Simulate DST transition
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-03-09T01:30:00-08:00')); // Before DST
  
  const alarm = { hour: 2, minute: 30 };
  const scheduled = scheduleNextAlarm(alarm);
  
  // Should schedule for 3:30 AM (after DST jump)
  expect(scheduled.getHours()).toBe(3);
});
```

---

### 2. Timezone Changes (Travel)

**Problem:**
User travels from Vietnam (UTC+7) to USA (UTC-8). Alarm set for 7:00 AM should fire at local 7:00 AM, not Vietnam time.

**Solution:**
```typescript
// Store alarms in local time, not UTC
interface StoredAlarm {
  hour: number;        // 0-23 (local time)
  minute: number;      // 0-59 (local time)
  timezone?: string;   // Optional: track original timezone
}

// On app launch, reschedule all alarms
class AlarmScheduler {
  async rescheduleAllAlarms() {
    const alarms = await repository.getAll();
    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    for (const alarm of alarms) {
      if (alarm.enabled) {
        // Reschedule using current timezone
        await this.scheduleAlarm(alarm);
        
        // Update stored timezone
        await repository.update({
          ...alarm,
          timezone: currentTz
        });
      }
    }
  }
}

// Call on app foreground
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    scheduler.rescheduleAllAlarms();
  }
});
```

---

### 3. Midnight Rollover

**Problem:**
Alarm set for 11:59 PM, then toggled on at 12:01 AM. Should it fire in 23h 58m, not in 58 seconds?

**Solution:**
```typescript
function getNextAlarmTime(alarm: Alarm): Date {
  const now = new Date();
  let next = new Date();
  next.setHours(alarm.hour, alarm.minute, 0, 0);
  
  // If alarm time has passed today
  if (next <= now) {
    // Check if it's within 5 minutes ago (grace period)
    const diff = (now.getTime() - next.getTime()) / 1000 / 60;
    
    if (diff < 5) {
      // Just missed it, schedule for tomorrow
      next = addDays(next, 1);
    } else {
      // Clearly in the past, schedule for tomorrow
      next = addDays(next, 1);
    }
  }
  
  return next;
}
```

---

## 🔋 Android Power Management

### 4. Doze Mode (Android 6.0+)

**Problem:**
Device enters Doze mode after 30+ minutes of inactivity. Alarms may not fire.

**Solution:**
```kotlin
// Use setExactAndAllowWhileIdle for critical alarms
val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    alarmManager.setExactAndAllowWhileIdle(
        AlarmManager.RTC_WAKEUP,
        triggerTime,
        pendingIntent
    )
} else {
    alarmManager.setExact(
        AlarmManager.RTC_WAKEUP,
        triggerTime,
        pendingIntent
    )
}
```

**User Guide:**
Provide in-app instructions:
```
🔋 To ensure alarms work reliably:

1. Settings → Apps → Mobile Alarm App
2. Battery → Unrestricted
3. Background activity → Allow
```

---

### 5. OEM Battery Optimization (Xiaomi, Oppo, etc.)

**Problem:**
Aggressive battery savers kill apps, preventing alarms.

**Solution:**
Detect OEM and show specific instructions:

```typescript
import DeviceInfo from 'react-native-device-info';

function getBatteryOptimizationInstructions() {
  const manufacturer = DeviceInfo.getManufacturer().toLowerCase();
  
  const instructions = {
    xiaomi: [
      'Settings → Apps → Manage apps',
      'Mobile Alarm App → Battery saver',
      'Select: No restrictions',
      'Autostart → Enable'
    ],
    oppo: [
      'Settings → Battery → App energy saving',
      'Mobile Alarm App',
      'Select: No restrictions'
    ],
    vivo: [
      'Settings → Battery',
      'Background energy consumption',
      'Mobile Alarm App → Allow'
    ],
    huawei: [
      'Settings → Apps',
      'Mobile Alarm App → Battery',
      'App launch → Manual',
      'Enable all three options'
    ]
  };
  
  return instructions[manufacturer] || instructions.xiaomi;
}
```

---

## 📦 iOS Background Limitations

### 6. 64 Notification Limit

**Problem:**
iOS can only schedule 64 local notifications at a time.

**Solution:**
Schedule only the next 7 days:

```typescript
class iOSAlarmScheduler {
  private MAX_NOTIFICATIONS = 60; // Reserve 4 for other app notifications
  private SCHEDULE_DAYS_AHEAD = 7;
  
  async scheduleAlarm(alarm: Alarm) {
    // Cancel existing notifications for this alarm
    await this.cancelAlarm(alarm.id);
    
    // Generate next 7 days of occurrences
    const occurrences = this.getNextOccurrences(
      alarm,
      this.SCHEDULE_DAYS_AHEAD
    );
    
    // Schedule each occurrence
    for (let i = 0; i < occurrences.length; i++) {
      await Notifee.createTriggerNotification(
        {
          id: `${alarm.id}_${i}`,
          title: alarm.label,
          body: 'Time to wake up!'
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: occurrences[i].getTime()
        }
      );
    }
  }
  
  // Reschedule when app opens
  async onAppForeground() {
    const alarms = await repository.getAll();
    for (const alarm of alarms.filter(a => a.enabled)) {
      await this.scheduleAlarm(alarm);
    }
  }
}
```

---

### 7. Silent Mode Override

**Problem:**
User has iPhone in silent mode. Alarm should still make sound.

**Solution:**
```typescript
// Request critical alert authorization (requires Apple approval)
await Notifee.requestPermission({
  criticalAlert: true
});

// Create notification with critical alert
await Notifee.displayNotification({
  title: 'Alarm',
  body: 'Wake up!',
  ios: {
    critical: true,
    criticalVolume: 1.0, // Max volume
    sound: 'alarm.wav'
  }
});
```

**Note:** Critical alerts require special entitlement from Apple.

---

## 📱 User Flow Edge Cases

### 8. Rapid Toggle On/Off

**Problem:**
User quickly toggles alarm on/off multiple times. Race conditions may occur.

**Solution:**
```typescript
class AlarmViewModel {
  private toggleDebounce = new Map<string, NodeJS.Timeout>();
  
  async toggleAlarm(alarmId: string, enabled: boolean) {
    // Cancel previous toggle if exists
    const existing = this.toggleDebounce.get(alarmId);
    if (existing) {
      clearTimeout(existing);
    }
    
    // Debounce toggle by 300ms
    return new Promise((resolve) => {
      const timeout = setTimeout(async () => {
        await this.performToggle(alarmId, enabled);
        this.toggleDebounce.delete(alarmId);
        resolve();
      }, 300);
      
      this.toggleDebounce.set(alarmId, timeout);
    });
  }
}
```

---

### 9. Storage Corruption

**Problem:**
AsyncStorage data becomes corrupted. App crashes on launch.

**Solution:**
```typescript
class AlarmRepository {
  async getAll(): Promise<Alarm[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) return [];
      
      const data = JSON.parse(json);
      
      // Validate structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data structure');
      }
      
      // Validate each alarm
      return data.map(this.validateAlarm).filter(Boolean);
      
    } catch (error) {
      console.error('Storage corrupted, resetting:', error);
      
      // Backup corrupted data
      await this.backupCorruptedData();
      
      // Reset storage
      await AsyncStorage.removeItem(STORAGE_KEY);
      
      return [];
    }
  }
  
  private validateAlarm(alarm: any): Alarm | null {
    if (!alarm.id || typeof alarm.hour !== 'number') {
      return null;
    }
    
    return {
      id: alarm.id,
      hour: Math.max(0, Math.min(23, alarm.hour)),
      minute: Math.max(0, Math.min(59, alarm.minute || 0)),
      enabled: alarm.enabled ?? true,
      // ... other fields with defaults
    };
  }
}
```

---

### 10. Memory Leak (Long-Running App)

**Problem:**
App left open for days. Memory usage grows.

**Solution:**
```typescript
class AlarmViewModel {
  private listeners: Array<() => void> = [];
  
  constructor() {
    // Cleanup on unmount
    this.cleanup = this.cleanup.bind(this);
  }
  
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  cleanup() {
    // Clear all listeners
    this.listeners = [];
    
    // Cancel pending operations
    this.toggleDebounce.forEach(timeout => clearTimeout(timeout));
    this.toggleDebounce.clear();
  }
}

// In component
useEffect(() => {
  const unsubscribe = viewModel.subscribe(handleUpdate);
  return unsubscribe; // Cleanup on unmount
}, []);
```

---

## 🔄 State Synchronization

### 11. Multiple App Instances

**Problem:**
User has iPad and iPhone. Changes on one device should sync.

**Solution:**
```typescript
// Use iCloud KeyValue storage for iOS
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

class SyncService {
  async syncAlarms() {
    if (Platform.OS === 'ios') {
      // Enable iCloud sync
      const { RNCAsyncStorage } = NativeModules;
      await RNCAsyncStorage.multiSet([
        ['@alarms', JSON.stringify(alarms)],
        ['@sync_timestamp', Date.now().toString()]
      ], true); // true = use iCloud
    }
  }
  
  // Listen for remote changes
  listenForRemoteChanges() {
    // iOS: NSUbiquitousKeyValueStore.didChangeExternallyNotification
    // Android: Could use Firebase Realtime Database
  }
}
```

---

## 🧪 Testing Edge Cases

### 12. Flaky E2E Tests

**Problem:**
Time-dependent tests fail randomly.

**Solution:**
```javascript
// Use explicit waits
await waitFor(element(by.id('alarm-card')))
  .toBeVisible()
  .withTimeout(5000);

// Don't use hard-coded delays
// BAD:
await new Promise(resolve => setTimeout(resolve, 1000));

// GOOD:
await waitFor(element(by.id('loading')))
  .not.toBeVisible()
  .withTimeout(5000);
```

---

## 📄 Summary

| Edge Case | Impact | Solution | Priority |
|-----------|--------|----------|----------|
| DST Transition | 🔴 High | UTC storage | ✅ |
| Timezone Change | 🔴 High | Reschedule on launch | ✅ |
| Doze Mode | 🔴 High | setExactAndAllowWhileIdle | ✅ |
| OEM Battery | 🔴 High | User guide | ✅ |
| iOS 64 limit | 🟡 Medium | Schedule 7 days | ✅ |
| Storage corruption | 🟡 Medium | Validation + backup | ✅ |
| Rapid toggle | 🟢 Low | Debounce | ✅ |
| Memory leak | 🟢 Low | Proper cleanup | ✅ |

---

## 🔗 Resources

- [Android Doze Mode](https://developer.android.com/training/monitoring-device-state/doze-standby)
- [iOS Background Execution](https://developer.android.com/docs/background-execution)
- [Don't Kill My App](https://dontkillmyapp.com/)
- [date-fns-tz Documentation](https://github.com/marnusw/date-fns-tz)