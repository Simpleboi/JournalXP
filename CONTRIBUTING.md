# Contributing to JournalXP 🧠

Thank you for considering contributing to **JournalXP**! We're excited to build a space where mental health and gamification meet, and your help makes a big difference.

---

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Coding Guidelines](#-coding-guidelines)
- [Commit Guidelines](#-commit-guidelines)
- [Testing](#-testing)
- [Pull Request Process](#-pull-request-process)
- [Code Review](#-code-review)

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 22+ installed
- **npm** 10+ installed
- **Firebase CLI**: `npm install -g firebase-tools`
- **Git** for version control
- A **Firebase project** (or use the existing one for local development)

### Fork and Clone

1. **Fork** this repository on GitHub
2. **Clone** your fork to your local machine:

```bash
git clone https://github.com/your-username/JournalXP.git
cd JournalXP
```

3. **Add the upstream remote**:

```bash
git remote add upstream https://github.com/Simpleboi/JournalXP.git
```

---

## 💻 Development Setup

### Install Dependencies

The project uses a monorepo structure. Install dependencies for all workspaces:

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Functions dependencies
cd functions && npm install && cd ..

# Shared dependencies
cd shared && npm install && cd ..
```

### Environment Configuration

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_API_PROD=https://journalxp-4ea0f.web.app/api
```

### Running the Development Environment

**Option 1: Full Stack Development**

Terminal 1 - Start Functions Emulator:

```bash
npm run emulators
# Or: firebase emulators:start --only functions
```

Terminal 2 - Start Frontend Dev Server:

```bash
npm run dev:front
# Or: cd frontend && npm run dev
```

**Option 2: Frontend Only**

If you're only working on frontend features:
```bash
cd frontend && npm run dev
```

### Access the App

- **Frontend**: http://localhost:5173
- **Functions Emulator**: http://localhost:5002
- **Emulator UI**: http://localhost:4000

---

## 📁 Project Structure

Understanding the codebase:

```md
JournalXP/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Feature modules (habits, journal, etc.)
│   │   ├── pages/         # Route-level components
│   │   ├── context/       # React contexts
│   │   ├── lib/           # Utilities, Firebase config, API helpers
│   │   └── App.tsx        # Main app component with routing
│   └── package.json
│
├── functions/             # Firebase Cloud Functions
│   ├── src/
│   │   ├── routes/        # Express API endpoints
│   │   ├── middleware/    # Auth, error handling
│   │   ├── lib/           # Firebase Admin SDK, utilities
│   │   ├── scripts/       # Migration and maintenance scripts
│   │   └── index.ts       # Cloud Function entry point
│   └── package.json
│
├── shared/                # Shared TypeScript code
│   ├── types/             # Common type definitions
│   └── utils/             # Shared utility functions
│
└── backend/               # Legacy server (archival, avoid editing)
```

### Path Aliases

Both frontend and functions use TypeScript path aliases:

- `@/*` → Points to `src/` directory
- `@shared/*` → Points to `../shared/` for shared types

Example:

```typescript
import { UserClient } from "@shared/types/user";
import { authFetch } from "@/lib/authFetch";
```

---

## 🧪 Coding Guidelines

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Define types explicitly** - Avoid `any` unless absolutely necessary
- **Use shared types** - Import from `@shared/types` when applicable
- **Interface over Type** - Prefer interfaces for object shapes

Example:

```typescript
// Good
interface HabitFormData {
  title: string;
  frequency: "daily" | "weekly";
  xpReward: number;
}

// Avoid
const createHabit = (data: any) => { ... }
```

### React Components

- **Functional components** - Use hooks, avoid class components
- **TypeScript for props** - Always type your component props
- **Destructure props** - For cleaner code
- **Use contexts** - For auth and user data 

Example:

```typescript
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  // Component logic
};
```

### Code Style

- **ESLint** - Follow the project's ESLint configuration
- **Prettier** - Use Prettier for consistent formatting
- **Naming conventions**:
  - Components: `PascalCase` (e.g., `TaskCard.tsx`)
  - Utilities: `camelCase` (e.g., `authFetch.ts`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_LEVEL`)
  - Types/Interfaces: `PascalCase` (e.g., `UserClient`)

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear git history:

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates

### Examples

```bash
# Feature
git commit -m "feat(habits): add streak counter to habit cards"

# Bug fix
git commit -m "fix(auth): resolve token refresh issue on session timeout"

# Documentation
git commit -m "docs: update README with deployment instructions"

# Refactor
git commit -m "refactor(tasks): simplify task completion logic"
```

### Scope Guidelines

Common scopes:

- `frontend` / `backend` / `functions` / `shared`
- Feature names: `habits`, `journal`, `tasks`, `pet`, `auth`
- Components: `ui`, `layout`, `forms`

---

## 🧪 Testing

### Running Tests

**Functions:**

```bash
cd functions

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

**Frontend:**

```bash
cd frontend
npm test
```

### Writing Tests

**Functions (Jest + Supertest):**

```typescript
import request from "supertest";
import app from "../app";

describe("POST /api/habits", () => {
  it("should create a new habit", async () => {
    const response = await request(app)
      .post("/api/habits")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ title: "Meditation", frequency: "daily" });

    expect(response.status).toBe(201);
    expect(response.body.habit).toHaveProperty("id");
  });
});
```

### Type Checking

Always run type checks before committing:

```bash
# Frontend
cd frontend && npm run build

# Functions
cd functions && npm run es-check
```

---

## 🔄 Pull Request Process

### Creating a Branch

Create a descriptive branch name:

```bash
# Feature branch
git checkout -b feature/habit-streak-notifications

# Bug fix branch
git checkout -b fix/journal-entry-validation

# Documentation branch
git checkout -b docs/api-endpoint-guide
```

### Before Submitting a PR

1. **Sync with upstream**:

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests**:

```bash
cd functions && npm test
cd frontend && npm test
```

3. **Type check**:

```bash
cd functions && npm run es-check
cd frontend && npm run build
```

4. **Build locally**:

```bash
npm run build
```

5. **Test with emulators**:

```bash
npm run emulators:all
```

### PR Template

When opening a PR, include:

**Title**: Follow conventional commits format

```bash
feat(habits): add weekly habit summary view
```

**Description**:

```markdown
## What does this PR do?
Brief description of changes

## Why?
Problem this solves or feature it adds

## Testing
- [ ] Unit tests added/updated
- [ ] Tested locally with emulators
- [ ] Type checks pass
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Issues
Closes #123
```

### PR Checklist

- [ ] Code follows the project's coding guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Tests added/updated
- [ ] Documentation updated (if needed)
- [ ] No console warnings or errors
- [ ] Builds successfully
- [ ] Tested in local environment

---

## 👀 Code Review

### What Reviewers Look For

- **Functionality**: Does it work as intended?
- **Code quality**: Is it readable and maintainable?
- **Performance**: Any performance concerns?
- **Security**: No vulnerabilities or data leaks?
- **Tests**: Adequate test coverage?
- **Documentation**: Clear comments and updated docs?

### Responding to Feedback

- Be open to suggestions
- Ask questions if feedback is unclear
- Make requested changes in new commits
- Notify reviewers when ready for re-review

---

## 🎯 Areas to Contribute

### Good First Issues

Look for issues labeled `good first issue`:

- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Adding tests

### Feature Requests

Check the **Future Features** section in README.md:

- Dark mode implementation
- Advanced meditation tools
- Mobile UI improvements
- Analytics features

### Bug Reports

Found a bug? Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, etc.)

---

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Give constructive feedback
- Celebrate contributions, big and small

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Questions?

If you have questions:
- Open a GitHub Discussion
- Check existing issues
- Reach out to maintainers

Thank you for contributing to JournalXP! Together, we're building a platform that makes mental health journaling accessible and engaging. 💙
