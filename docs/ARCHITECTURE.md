# Architecture Guide

## Overview

Mobile Alarm App follows **Clean Architecture** principles, ensuring separation of concerns and testability.

## Layers

### 1. Domain Layer

Core business logic, independent of frameworks.

**Location:** `src/domain/`

**Contains:**
- **Entities** - Business models (Alarm, User)
- **Use Cases** - Business operations (CreateAlarm, DeleteAlarm)
- **Repository Interfaces** - Data contracts

**Example:**
```typescript
// Entity
export interface Alarm {
  id: string;
  label: string;
  hour: number;
  minute: number;
  enabled: boolean;
}

// Use Case
export class CreateAlarmUseCase {
  async execute(data: CreateAlarmDto): Promise<Result<Alarm>> {
    // Business logic here
  }
}
```

### 2. Infrastructure Layer

Data persistence and external APIs.

**Location:** `src/infrastructure/`

**Contains:**
- **Repositories** - Data implementation (AsyncStorage, API)
- **Storage** - Local data storage
- **Native Modules** - Platform-specific code

**Example:**
```typescript
export class AlarmRepository implements IAlarmRepository {
  async getAll(): Promise<Alarm[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return JSON.parse(data) || [];
  }
}
```

### 3. Presentation Layer

UI and presentation logic.

**Location:** `src/presentation/`

**Contains:**
- **Screens** - React Native screens
- **Components** - Reusable UI components
- **ViewModels** - Presentation logic (MVVM)
- **Navigation** - Routing configuration
- **Store** - Global state (Zustand)

**Example:**
```typescript
export class AlarmViewModel {
  async createAlarm(data: CreateAlarmDto): Promise<boolean> {
    const result = await this.createAlarmUseCase.execute(data);
    if (result.success) {
      this.store.addAlarm(result.data);
      return true;
    }
    return false;
  }
}
```

### 4. Services Layer

External services and utilities.

**Location:** `src/services/`

**Contains:**
- **NotificationService** - Push notifications
- **AlarmScheduler** - Alarm scheduling
- **I18nService** - Internationalization

## Data Flow

```
UI → ViewModel → Use Case → Repository → Data Source
                      ↓
                   Service
```

1. **User Action** - User interacts with UI
2. **ViewModel** - Handles presentation logic
3. **Use Case** - Executes business logic
4. **Repository** - Fetches/stores data
5. **Service** - Handles external operations
6. **State Update** - UI reflects changes

## Design Patterns

### Repository Pattern

Abstracts data access.

```typescript
interface IAlarmRepository {
  getAll(): Promise<Alarm[]>;
  create(data: CreateAlarmDto): Promise<Alarm>;
}
```

### Use Case Pattern

Encapsulates business logic.

```typescript
class CreateAlarmUseCase {
  constructor(private repository: IAlarmRepository) {}
  
  async execute(data: CreateAlarmDto): Promise<Result<Alarm>> {
    // Validation + business rules
  }
}
```

### MVVM Pattern

Separates UI from business logic.

```
View (Screen) ← ViewModel ← Use Cases
```

### Observer Pattern (Zustand)

Manages global state.

```typescript
const useAlarmStore = create((set) => ({
  alarms: [],
  addAlarm: (alarm) => set((state) => ({ 
    alarms: [...state.alarms, alarm] 
  }))
}));
```

## Benefits

- **Testability** - Each layer can be tested independently
- **Maintainability** - Clear separation of concerns
- **Scalability** - Easy to add new features
- **Flexibility** - Easy to swap implementations

## Testing Strategy

- **Unit Tests** - Use cases, utilities (70%)
- **Integration Tests** - Repository + Storage (20%)
- **E2E Tests** - User flows (10%)

## Next Steps

- Read [Testing Guide](TESTING.md)
- Read [Setup Guide](SETUP.md)
- See [Contributing Guidelines](../CONTRIBUTING.md)