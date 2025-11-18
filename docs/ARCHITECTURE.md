# JournalXP Architecture

## Overview

JournalXP uses a **hybrid monorepo architecture** with separate web and mobile frontends sharing a common backend and business logic.

```
┌─────────────────────────────────────────────────────────────┐
│                      JournalXP Monorepo                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐              ┌──────────────┐           │
│  │   Frontend   │              │    Mobile    │           │
│  │  (React Web) │              │ (React Native)│          │
│  │              │              │     Expo     │           │
│  └──────┬───────┘              └──────┬───────┘           │
│         │                             │                    │
│         │        ┌──────────────┐     │                    │
│         └────────┤    Shared    ├─────┘                    │
│                  │ Types, Utils │                          │
│                  │   Services   │                          │
│                  └──────┬───────┘                          │
│                         │                                   │
│                  ┌──────┴───────┐                          │
│                  │   Functions  │                          │
│                  │   (Backend)  │                          │
│                  │  Cloud Fns   │                          │
│                  └──────┬───────┘                          │
│                         │                                   │
│                  ┌──────┴───────┐                          │
│                  │   Firestore  │                          │
│                  │  (Database)  │                          │
│                  └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

```
JournalXP/
├── frontend/           # React web app (existing)
│   ├── src/
│   │   ├── pages/      # Web-specific pages
│   │   ├── features/   # Web-specific components
│   │   ├── lib/        # Web-specific utilities
│   │   └── services/   # Web service wrappers
│   └── package.json
│
├── mobile/             # React Native Expo app (NEW)
│   ├── app/            # Expo Router screens
│   ├── src/
│   │   ├── components/ # Mobile-specific components
│   │   ├── lib/        # Mobile-specific utilities
│   │   └── services/   # Mobile service wrappers
│   └── package.json
│
├── shared/             # Shared code between web & mobile
│   ├── types/          # TypeScript interfaces
│   │   ├── user.ts
│   │   ├── journal.ts
│   │   └── api.ts
│   ├── utils/          # Business logic utilities
│   │   ├── levelSystem.ts
│   │   ├── rankSystem.ts
│   │   └── date.ts
│   └── services/       # Platform-agnostic API services
│       └── journalService.ts
│
├── functions/          # Firebase Cloud Functions (backend)
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── middleware/ # Auth, error handling
│   │   └── lib/        # Backend utilities
│   └── package.json
│
└── package.json        # Root workspace configuration
```

## Code Sharing Strategy

### ✅ 100% Shared (No Duplication)

These are completely shared between web and mobile:

1. **Backend API** (`functions/`)
   - All API endpoints
   - Business logic
   - Database operations
   - Authentication middleware

2. **Database Schema** (Firestore)
   - User documents
   - Journal entries
   - Habits, tasks, etc.

3. **TypeScript Types** (`shared/types/`)
   - User interfaces
   - API request/response types
   - Data models

4. **Business Logic** (`shared/utils/`)
   - XP and level calculations
   - Rank progression logic
   - Date formatting utilities
   - Streak calculations

### 🔄 Adapted (Platform-Specific Wrappers)

These use shared logic but have platform-specific implementations:

1. **API Services** (`shared/services/` + platform wrappers)
   - Shared service definitions
   - Platform-specific `authFetch` implementations
   - Web uses `firebase/auth` for web
   - Mobile uses `firebase/auth` for React Native

2. **Authentication Flow**
   - Same Firebase Auth backend
   - Same token-based authentication
   - Platform-specific UI components
   - Shared auth state management pattern

3. **Navigation**
   - Same route structure
   - Web uses React Router
   - Mobile uses Expo Router
   - Similar navigation patterns

### ❌ Platform-Specific (Separate Implementations)

These are completely different per platform:

1. **UI Components**
   - Web: React DOM components + TailwindCSS
   - Mobile: React Native components + StyleSheet

2. **Routing**
   - Web: React Router v6
   - Mobile: Expo Router (file-based)

3. **Styling**
   - Web: TailwindCSS, Radix UI
   - Mobile: StyleSheet, potentially NativeWind or RN Paper

4. **Platform Features**
   - Web: PWA capabilities
   - Mobile: Push notifications, native gestures

## Service Layer Pattern

### Shared Service Definition

`shared/services/journalService.ts`:

```typescript
import type { JournalEntryPayload, JournalEntryResponse } from '../types/journal';

export type AuthFetchFunction = (path: string, init?: RequestInit) => Promise<any>;

export function createJournalService(authFetch: AuthFetchFunction) {
  async function saveJournalEntry(entry: JournalEntryPayload): Promise<JournalEntryResponse> {
    return authFetch("/journals", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  }

  return { saveJournalEntry };
}
```

### Web Implementation

`frontend/src/services/journalService.ts`:

```typescript
import { authFetch } from '@/lib/authFetch'; // Web-specific
import { createJournalService } from '@shared/services/journalService';

export const { saveJournalEntry } = createJournalService(authFetch);
```

### Mobile Implementation

`mobile/src/services/journalService.ts`:

```typescript
import { authFetch } from '../lib/authFetch'; // Mobile-specific
import { createJournalService } from '@shared/services/journalService';

export const { saveJournalEntry } = createJournalService(authFetch);
```

### Usage in Components

Both platforms use the same API:

```typescript
// Works the same on web and mobile!
import { saveJournalEntry } from '../services/journalService';

const entry = await saveJournalEntry({ content: "Today was great!" });
```

## Authentication Flow

### 1. Client Sign In

**Web:**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Web config

await signInWithEmailAndPassword(auth, email, password);
```

**Mobile:**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Mobile config

await signInWithEmailAndPassword(auth, email, password);
```

### 2. Session Initialization

Both platforms call the same backend endpoint:

```typescript
import { authFetch } from './lib/authFetch'; // Platform-specific import

const response = await authFetch('/session/init', { method: 'POST' });
// Returns: { user: UserClient, sessionCookie: boolean }
```

### 3. Authenticated Requests

Both platforms use the same pattern:

```typescript
// Platform-specific authFetch automatically adds token
const journals = await authFetch('/journals'); // GET
const newJournal = await authFetch('/journals', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## Development Workflow

### Running Web App

```bash
npm run dev:web
# Runs on http://localhost:5173
```

### Running Mobile App

```bash
npm run dev:mobile
# Starts Expo Metro bundler
# Scan QR code with Expo Go app
```

### Running Backend

```bash
npm run emulators:all
# Starts Firebase emulators
# Functions: http://localhost:5001
# Firestore: http://localhost:8080
```

### Working on Shared Code

When you modify shared code (`shared/types/`, `shared/utils/`, `shared/services/`):

1. Both web and mobile automatically pick up changes
2. No need to rebuild or restart (hot reload works)
3. TypeScript will catch type errors across all platforms

Example workflow:

```bash
# 1. Modify shared/utils/levelSystem.ts
# 2. Save file
# 3. Both web (localhost:5173) and mobile (Expo Go) update automatically
```

## Building and Deployment

### Web App

```bash
npm run build:web        # Build frontend
npm run deploy:hosting   # Deploy to Firebase Hosting
```

### Mobile App (iOS without Mac!)

```bash
cd mobile
eas build --platform ios   # Cloud build - no Mac needed!
eas build --platform android
```

### Backend

```bash
npm run deploy:functions  # Deploy Cloud Functions
```

## Advantages of This Architecture

### ✅ Code Reuse

- ~40-50% code shared (types, utils, services, business logic)
- Single source of truth for business logic
- One backend to maintain

### ✅ Consistency

- Same API for both platforms
- Same XP/level calculations
- Same user data structure
- Consistent behavior across platforms

### ✅ Independent Development

- Web and mobile can evolve independently
- Different release schedules
- Platform-specific optimizations

### ✅ No Mac Required for iOS

- Expo EAS Build runs in the cloud
- Can build iOS apps from Windows/Linux
- Test on physical devices with Expo Go

### ✅ Best of Both Worlds

- Optimized web experience (Vite, React Router, TailwindCSS)
- Native mobile experience (React Native, Expo, native gestures)
- Progressive Web App for mobile web users

## Migration Strategy

### Phase 1: ✅ Foundation (Current)

- [x] Monorepo setup
- [x] Expo app structure
- [x] Shared types and utils
- [x] Shared services pattern
- [x] Journal feature demo

### Phase 2: 🚧 Core Features (Next)

- [ ] Firebase integration (mobile)
- [ ] Authentication flow (mobile)
- [ ] Tasks feature (mobile)
- [ ] Habits feature (mobile)
- [ ] User profile (mobile)

### Phase 3: 📋 Advanced Features

- [ ] Sunday AI chat (mobile)
- [ ] Community (mobile)
- [ ] Pet system (mobile)
- [ ] Meditation room (mobile)
- [ ] Push notifications
- [ ] Offline support

### Phase 4: 🎨 Polish

- [ ] UI component library (NativeWind or RN Paper)
- [ ] Animations (React Native Reanimated)
- [ ] App icons and branding
- [ ] App store deployment
- [ ] Analytics integration

## FAQ

### Why not a single codebase with React Native Web?

- Web app already exists and is optimized
- React Native Web has limitations (styling, performance)
- Better to have platform-specific optimizations
- Shared backend and business logic is more important

### Why Expo instead of bare React Native?

- No Mac required for iOS builds (EAS Build)
- Faster development (Expo Go app)
- Built-in tools and libraries
- Easy OTA updates
- Better developer experience

### How much code is duplicated?

- UI components: ~60% (platform-specific)
- Business logic: 0% (100% shared)
- API services: ~20% (platform wrappers only)
- Overall: ~30-40% duplication, mostly UI

### Can I remove Capacitor now?

- Yes, if you're only using Expo for mobile
- Keep it if you want hybrid approach
- Android: Can build with either Capacitor or Expo
- iOS: Expo is better (no Mac needed)

### Do both apps use the same database?

- Yes! Same Firebase project
- Same Firestore collections
- Same user accounts
- Data syncs automatically across platforms

## Technical Decisions

### Why Monorepo?

- Easier code sharing
- Single npm install
- Shared dependencies
- Atomic commits across platforms

### Why Not Turborepo/Nx?

- npm workspaces is sufficient for this project
- Less complexity
- Easier to understand
- Can migrate later if needed

### Why Firebase?

- Already using it for web
- Great React Native support
- Real-time database
- Free tier is generous
- Easy authentication

### Why TypeScript?

- Type safety across platforms
- Better IDE support
- Shared type definitions
- Catch bugs before runtime

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase for Web/React Native](https://firebase.google.com/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
