# Testing Guide

Comprehensive testing guide for Mobile Alarm App.

---

## Overview

Our testing strategy follows the testing pyramid:

```
        /\        E2E Tests (Detox)
       /  \       ~10 tests
      /____\      
     /      \     Integration Tests
    /        \    ~30 tests
   /__________\   
  /            \  Unit Tests (Jest)
 /______________\ ~100+ tests
```

---

## Unit Tests

### Running Tests

```bash
# Run all unit tests
npm test

# Watch mode (auto-rerun)
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test -- CreateAlarm.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create alarm"
```

### Test Structure

```typescript
// Example: CreateAlarmUseCase.test.ts
import { CreateAlarmUseCase } from '@domain/usecases/CreateAlarm';

describe('CreateAlarmUseCase', () => {
  let useCase: CreateAlarmUseCase;
  let mockRepository: jest.Mocked<IAlarmRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    useCase = new CreateAlarmUseCase(mockRepository);
  });

  describe('Success Cases', () => {
    it('should create alarm with valid data', async () => {
      // Arrange
      const input = { hour: 7, minute: 30, label: 'Morning' };
      
      // Act
      const result = await useCase.execute(input);
      
      // Assert
      expect(result.success).toBe(true);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Errors', () => {
    it('should fail when hour is invalid', async () => {
      const result = await useCase.execute({ hour: 25, minute: 0 });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid hour');
    });
  });
});
```

### Coverage Requirements

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

**What to test:**
- ✅ Use Cases (business logic)
- ✅ ViewModels (presentation logic)
- ✅ Repositories (data operations)
- ✅ Utilities & Helpers
- ❌ UI Components (use E2E instead)
- ❌ Navigation (use E2E instead)

---

## E2E Tests (Detox)

### Prerequisites

```bash
# Install Detox CLI
npm install -g detox-cli

# iOS: Install applesimutils
brew tap wix/brew
brew install applesimutils

# Android: Ensure emulator is installed
# Open Android Studio > AVD Manager
# Create: Pixel 7 API 34
```

### Setup

```bash
# Install dependencies
npm install --save-dev detox jest

# Initialize Detox (already done)
detox init -r jest
```

### Running E2E Tests

#### iOS

```bash
# Build app for testing
detox build --configuration ios.sim.debug

# Run tests
detox test --configuration ios.sim.debug

# Run specific test file
detox test --configuration ios.sim.debug e2e/alarm-creation.test.js

# Run with logs
detox test --configuration ios.sim.debug --loglevel trace
```

#### Android

```bash
# Start emulator first
emulator -avd Pixel_7_API_34

# Build app
detox build --configuration android.emu.debug

# Run tests
detox test --configuration android.emu.debug

# Cleanup
detox clean-framework-cache
detox rebuild-framework-cache
```

### Test Structure

```javascript
// e2e/alarm-creation.test.js
describe('Alarm Creation Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' }
    });
  });

  it('should create alarm successfully', async () => {
    // 1. Navigate
    await element(by.id('add-alarm-button')).tap();
    
    // 2. Fill form
    await element(by.id('alarm-label-input')).typeText('Test');
    
    // 3. Submit
    await element(by.id('save-button')).tap();
    
    // 4. Assert
    await expect(element(by.text('Test'))).toBeVisible();
  });
});
```

### Test IDs

Always add `testID` to components:

```typescript
// Good
<Button testID="add-alarm-button" onPress={onAdd}>
  Add Alarm
</Button>

// Bad
<Button onPress={onAdd}>Add Alarm</Button>
```

### Common Matchers

```javascript
// Visibility
await expect(element(by.id('my-id'))).toBeVisible();
await expect(element(by.id('my-id'))).not.toBeVisible();

// Text
await expect(element(by.id('my-id'))).toHaveText('Hello');

// Value (for inputs)
await expect(element(by.id('input'))).toHaveValue('text');

// Existence
await expect(element(by.id('my-id'))).toExist();
```

### Common Actions

```javascript
// Tap
await element(by.id('button')).tap();

// Type text
await element(by.id('input')).typeText('Hello');
await element(by.id('input')).clearText();

// Scroll
await element(by.id('scrollview')).scrollTo('bottom');

// Swipe
await element(by.id('card')).swipe('left', 'fast');

// Long press
await element(by.id('item')).longPress();

// Wait for element
await waitFor(element(by.id('async-element')))
  .toBeVisible()
  .withTimeout(5000);
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  e2e-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: pod install --project-directory=ios
      - run: detox build --configuration ios.sim.release
      - run: detox test --configuration ios.sim.release --cleanup

  e2e-android:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: npm ci
      - run: detox build --configuration android.emu.release
      - run: detox test --configuration android.emu.release
```

---

## Debugging Tests

### Unit Tests

```bash
# Debug with Chrome DevTools
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open: chrome://inspect
```

### E2E Tests

```bash
# Run with video recording
detox test --configuration ios.sim.debug --record-videos all

# Take screenshots on failure
detox test --configuration ios.sim.debug --take-screenshots failing

# Artifacts stored in: artifacts/
```

---

## Best Practices

### Unit Tests

1. **One assertion per test** (when possible)
2. **Use descriptive test names**: `should create alarm when valid data provided`
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**
5. **Don't test implementation details**

### E2E Tests

1. **Test user flows, not individual features**
2. **Keep tests independent** (no shared state)
3. **Use explicit waits** (`waitFor`)
4. **Clean up after tests**
5. **Avoid hard-coded delays** (`await new Promise(resolve => setTimeout(resolve, 1000))`)

---
## Test Coverage Goals

| Layer | Target | Current |
|-------|--------|----------|
| Use Cases | 90%+ | ✅ 92% |
| ViewModels | 80%+ | ✅ 85% |
| Repositories | 80%+ | ✅ 83% |
| Services | 70%+ | ✅ 75% |
| Overall | 70%+ | ✅ 78% |

---

## Troubleshooting

### Jest issues

```bash
# Clear cache
jest --clearCache

# Update snapshots
jest --updateSnapshot
```

### Detox issues

```bash
# Reset Detox
detox clean-framework-cache
detox rebuild-framework-cache

# Reset iOS simulator
xcrun simctl erase all

# Reset Android emulator
adb -e emu kill
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)