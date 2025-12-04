# Setup Guide

Complete setup guide for Mobile Alarm App development environment.

---

## Prerequisites

### Required Tools

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn 1.22+)
- **Git** 2.x

### iOS Development (macOS only)

- **Xcode** 14.3 or higher
- **CocoaPods** 1.13 or higher
- **Xcode Command Line Tools**

```bash
# Install Xcode from App Store
# Then install Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods
```

### Android Development

- **JDK** 17 (recommended: Azul Zulu or OpenJDK)
- **Android Studio** Hedgehog or higher
- **Android SDK** Platform 34
- **Android SDK Build-Tools** 34.0.0

```bash
# Verify Java installation
java -version
# Should show: openjdk version "17.x.x"

# Set ANDROID_HOME environment variable
# macOS/Linux: ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows: System Environment Variables
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/vuanhtuan2000work/mobile-alarm-app.git
cd mobile-alarm-app
```

### 2. Install Dependencies

```bash
# Install JavaScript dependencies
npm install

# Or with yarn
yarn install
```

### 3. iOS Setup (macOS only)

```bash
# Install iOS dependencies
cd ios
pod install
cd ..

# If pod install fails, try:
pod repo update
pod install --repo-update
```

### 4. Android Setup

No additional steps needed. Gradle will download dependencies automatically.

---

## Running the App

### Development Mode

#### iOS

```bash
# Start Metro bundler
npm start

# In another terminal
npm run ios

# Or specific simulator
npm run ios -- --simulator="iPhone 15 Pro"
```

#### Android

```bash
# Start Metro bundler
npm start

# In another terminal
npm run android

# Or specific device
adb devices  # List devices
npm run android -- --deviceId=DEVICE_ID
```

### Production Build

#### iOS

```bash
# Archive for TestFlight/App Store
cd ios
xcodebuild -workspace MobileAlarmApp.xcworkspace \
  -scheme MobileAlarmApp \
  -configuration Release \
  -archivePath build/MobileAlarmApp.xcarchive \
  archive
```

#### Android

```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB (for Play Store)
./gradlew bundleRelease

# Output:
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Development Workflow

### Branch Strategy

```
main (production)
  └─ develop (development)
      ├─ feature/alarm-list
      ├─ feature/settings
      └─ fix/notification-bug
```

### Creating a Feature

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# ... code ...

# 4. Commit (follows conventional commits)
git add .
git commit -m "feat(alarm): add snooze functionality"

# 5. Push and create PR
git push origin feature/your-feature-name
```

### Code Quality Checks

```bash
# Run all checks before committing
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm test              # Jest tests

# Auto-fix issues
npm run lint:fix
```

---

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Open coverage in browser
open coverage/lcov-report/index.html
```

### E2E Tests

```bash
# Build E2E app
npm run e2e:build:ios
npm run e2e:build:android

# Run E2E tests
npm run e2e:test:ios
npm run e2e:test:android
```

---

## Debugging

### React Native Debugger

```bash
# Install
brew install --cask react-native-debugger

# Enable in app
# iOS: Cmd+D → Debug
# Android: Cmd+M → Debug
```

### Flipper

```bash
# Install
brew install --cask flipper

# Already configured in project
# Just open Flipper after running app
```

### Native Logs

```bash
# iOS logs
npx react-native log-ios

# Android logs
npx react-native log-android

# Or use adb directly
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## Common Issues

### Metro Bundler Issues

```bash
# Clear cache
npm start -- --reset-cache

# Or
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/build
rm -rf android/app/build
npm install
cd ios && pod install && cd ..
```

### iOS Build Failures

```bash
# Clean build folder
cd ios
xcodebuild clean
rm -rf ~/Library/Developer/Xcode/DerivedData
pod deintegrate
pod install
```

### Android Build Failures

```bash
# Clean gradle
cd android
./gradlew clean
rm -rf .gradle
rm -rf app/build
```

### TypeScript Errors

```bash
# Regenerate types
npm run typecheck

# Check tsconfig paths
cat tsconfig.json
```

---

## Environment Variables

Create `.env` file:

```bash
# Development
API_URL=http://localhost:3000
ENABLE_SENTRY=false

# Production
API_URL=https://api.production.com
ENABLE_SENTRY=true
SENTRY_DSN=your_sentry_dsn
```

---

## Project Structure

```
mobile-alarm-app/
├── src/
│   ├── domain/              # Business logic
│   ├── infrastructure/      # Data layer
│   ├── presentation/        # UI layer
│   ├── services/            # External services
│   └── utils/               # Utilities
├── __tests__/              # Test files
├── android/                # Android native
├── ios/                    # iOS native
├── .github/                # GitHub config
└── docs/                   # Documentation
```

---

## Next Steps

1. Read [Architecture Guide](ARCHITECTURE.md)
2. Read [Testing Guide](TESTING.md)
3. Read [Native Setup](NATIVE_SETUP.md)
4. Read [Contributing Guidelines](../CONTRIBUTING.md)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/vuanhtuan2000work/mobile-alarm-app/issues)
- **Discussions:** [GitHub Discussions](https://github.com/vuanhtuan2000work/mobile-alarm-app/discussions)
- **Email:** [Contact](mailto:support@mobilealarmapp.com)