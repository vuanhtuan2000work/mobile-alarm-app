# Native Setup Guide

## Overview

This guide covers platform-specific configuration for iOS and Android to enable alarm notifications.

---

## Android Setup

### 1. Permissions

Already configured in `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Required Permissions -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
```

### 2. Boot Receiver

Reschedules alarms after device restart:

- `BootReceiver.java` - Listens for BOOT_COMPLETED
- Automatically relaunches app to reschedule alarms

### 3. Alarm Receiver

- `AlarmReceiver.java` - Handles alarm firing events
- Works with Notifee for notification display

### 4. Battery Optimization

**IMPORTANT:** Users must manually whitelist the app on some devices:

#### Xiaomi (MIUI)
```
Settings → Apps → Manage apps → Mobile Alarm App
→ Battery saver → No restrictions
→ Autostart → Enable
```

#### Oppo (ColorOS)
```
Settings → Battery → App energy saving
→ Mobile Alarm App → No restrictions
```

#### Vivo (FuntouchOS)
```
Settings → Battery → Background energy consumption
→ Mobile Alarm App → Allow
```

#### Huawei (EMUI)
```
Settings → Apps → Mobile Alarm App
→ Battery → App launch → Manual
→ Enable all options
```

### 5. Testing on Android

```bash
# Build and run
npm run android

# Test alarm scheduling
adb shell dumpsys alarm | grep com.mobilealarmapp

# Test notification
adb shell cmd notification post -S bigtext -t 'Test' 'Tag' 'Body'

# Simulate device idle (Doze mode)
adb shell dumpsys deviceidle force-idle

# Exit idle
adb shell dumpsys deviceidle unforce

# Check battery optimization status
adb shell dumpsys deviceidle whitelist
```

---

## iOS Setup

### 1. Capabilities

In Xcode:

1. Open `ios/MobileAlarmApp.xcworkspace`
2. Select target → Signing & Capabilities
3. Add capabilities:
   - ✅ Background Modes
     - Audio, AirPlay, and Picture in Picture
     - Background fetch
   - ✅ Push Notifications
   - ✅ Time Sensitive Notifications (if available)

### 2. Info.plist Configuration

Already configured in `ios/MobileAlarmApp/Info.plist`:

```xml
<!-- Background Modes -->
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
    <string>fetch</string>
</array>

<!-- Notification Settings -->
<key>UNUserNotificationCenterDelegate</key>
<true/>
```

### 3. Critical Alerts (Optional)

**Requires special entitlement from Apple:**

1. Request entitlement: https://developer.apple.com/contact/request/notifications-critical-alerts-entitlement/
2. Add to entitlements file:
```xml
<key>com.apple.developer.usernotifications.critical-alerts</key>
<true/>
```

### 4. iOS Limitations

- **64 notification limit:** iOS can only schedule 64 pending notifications
- **Solution:** App schedules only next 7 days of alarms
- **Auto-refresh:** When app opens, reschedules next batch

### 5. Testing on iOS

```bash
# Build and run
npm run ios

# Check scheduled notifications
lldb> po [[UNUserNotificationCenter currentNotificationCenter] getPendingNotificationRequestsWithCompletionHandler:^(NSArray * requests) { NSLog(@"%@", requests); }]

# Test notification sound
# In Xcode: Product → Scheme → Edit Scheme
# → Run → Options → Allow Location Simulation
```

---

## Common Issues

### Alarms not firing when app is killed

**Android:**
- Check battery optimization whitelist
- Verify SCHEDULE_EXACT_ALARM permission granted
- Test on stock Android (Pixel) first

**iOS:**
- Verify Background Modes enabled
- Check notification permissions
- Ensure sound file exists in bundle

### Alarms fire late

**Android:**
- Device in Doze mode → Use `setExactAndAllowWhileIdle()`
- Check OEM-specific battery settings

**iOS:**
- iOS may delay non-critical notifications
- Consider critical alerts (requires approval)

### Sound not playing

**Android:**
- Check notification channel importance (must be HIGH)
- Verify sound file in `android/app/src/main/res/raw/`

**iOS:**
- Check sound file in Xcode project
- Verify file format (caf, aiff, wav < 30 seconds)

---

## Production Checklist

### Android
- [ ] ProGuard rules configured
- [ ] Signed APK/AAB
- [ ] Tested on Xiaomi/Oppo/Vivo devices
- [ ] Battery optimization guide in app
- [ ] targetSdkVersion = 34

### iOS
- [ ] Provisioning profile configured
- [ ] Capabilities enabled in Xcode
- [ ] Tested on real device (not simulator)
- [ ] App Store privacy declarations
- [ ] Background modes justified

---

## Resources

- [Notifee Documentation](https://notifee.app/)
- [Android AlarmManager](https://developer.android.com/training/scheduling/alarms)
- [iOS Local Notifications](https://developer.apple.com/documentation/usernotifications)
- [Don't Kill My App](https://dontkillmyapp.com/) - Battery optimization guide