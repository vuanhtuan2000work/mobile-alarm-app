# Contributing to Mobile Alarm App

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Workflow

### 1. Fork and Clone

```bash
git clone https://github.com/vuanhtuan2000work/mobile-alarm-app.git
cd mobile-alarm-app
npm install
```

### 2. Create a Feature Branch

Always create a new branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `docs/` - Documentation changes

### 3. Make Your Changes

- Follow the existing code style
- Write clear, self-documenting code
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes

```bash
# Run linter
npm run lint

# Run type checker
npm run typecheck

# Run tests
npm test

# Test on iOS
npm run ios

# Test on Android
npm run android
```

### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(alarm): add snooze functionality"
```

Commit message format:
```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub:
1. Go to the repository
2. Click "New Pull Request"
3. Select `develop` as the base branch
4. Fill in the PR template
5. Wait for review

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Avoid `any` type
- Define interfaces for props and state
- Use explicit return types for functions

### React

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use proper prop types

### File Organization

```
src/
├── presentation/    # UI layer
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   └── viewmodels/
├── domain/          # Business logic
│   ├── entities/
│   ├── usecases/
│   └── repositories/
├── infrastructure/  # Data layer
└── services/        # External services
```

## Testing

- Write unit tests for use cases
- Write component tests for UI
- Maintain >70% code coverage
- Test on both iOS and Android

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Documentation updated
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] PR description is clear
- [ ] Linked to related issue (if any)

## Code Review Process

1. PR is created
2. Automated checks run (CI)
3. Code review by maintainers
4. Address feedback
5. PR is merged to `develop`
6. Changes are included in next release

## Getting Help

- Check existing issues
- Ask questions in discussions
- Join our community chat

## License

By contributing, you agree that your contributions will be licensed under the MIT License.