# 🚨 Mobile Alarm App

> Cross-platform mobile alarm application built with React Native

[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📱 Features

- ✅ Reliable alarm system (works when app is closed)
- 🔔 Multiple alarms with custom sounds
- 🌙 Sleep reminders & bedtime notifications
- 🌍 Multilingual support (7 languages)
- 📱 Cross-platform (iOS & Android)
- 🎨 Clean, minimal UI

## 🏗️ Architecture

This project follows **Clean Architecture** principles:

```
src/
├── presentation/     # UI Layer (Screens, Components)
├── domain/          # Business Logic (Use Cases, Entities)
├── infrastructure/  # Data Layer (Repositories, Storage)
└── services/        # External Services (Notifications, etc.)
```

## 🛠️ Tech Stack

- **Framework:** React Native 0.76.5
- **Language:** TypeScript 5.x
- **Navigation:** React Navigation 7.x
- **State Management:** Zustand 4.x
- **Notifications:** Notifee
- **Storage:** AsyncStorage
- **i18n:** react-i18next

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- **iOS:** Xcode 14.3+, CocoaPods
- **Android:** JDK 17, Android Studio

### Installation

```bash
# Clone repository
git clone https://github.com/vuanhtuan2000work/mobile-alarm-app.git
cd mobile-alarm-app

# Install dependencies
npm install

# iOS: Install pods
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📦 Project Structure

```
mobile-alarm-app/
├── .github/              # GitHub templates & workflows
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── presentation/
│   │   ├── screens/      # App screens
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation setup
│   │   └── viewmodels/   # MVVM logic
│   ├── domain/
│   │   ├── entities/     # Business entities
│   │   ├── usecases/     # Business logic
│   │   └── repositories/ # Repository interfaces
│   ├── infrastructure/
│   │   ├── repositories/ # Repository implementations
│   │   ├── storage/      # Local storage
│   │   └── native/       # Native module bridges
│   ├── services/
│   │   ├── AlarmScheduler.ts
│   │   ├── NotificationService.ts
│   │   └── I18nService.ts
│   └── utils/            # Utilities
├── __tests__/            # Test files
├── .eslintrc.js          # ESLint config
├── tsconfig.json         # TypeScript config
└── package.json
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run e2e:ios
npm run e2e:android
```

## 📝 Git Workflow (Agile/Scrum)

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `hotfix/*` - Emergency fixes
- `release/*` - Release preparation

### Commit Convention

```bash
feat(alarm): add snooze functionality
fix(scheduler): resolve timezone handling bug
test(alarm): add unit tests for CreateAlarm
docs: update README with setup instructions
chore: update dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Team

- **Tech Lead:** @vuanhtuan2000work
- **Developers:** Contributions welcome!

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Testing Guide](docs/TESTING.md)

## 🐛 Known Issues

See [GitHub Issues](https://github.com/vuanhtuan2000work/mobile-alarm-app/issues)

## 🗺️ Roadmap

- [x] Project initialization
- [ ] Core alarm functionality
- [ ] Notification system
- [ ] Settings & preferences
- [ ] Multilingual support
- [ ] Beta release
- [ ] Production release

---

Made with ❤️ using React Native