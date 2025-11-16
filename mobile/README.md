# JournalXP Mobile (Expo)

Native iOS and Android app for JournalXP built with Expo and React Native.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Expo Go app on your iPhone
- For Android: Expo Go app on your Android device OR Android emulator

### Installation

From the project root:

```bash
npm install
```

Or from the mobile directory:

```bash
cd mobile
npm install
```

### Running the App

#### Development Mode

```bash
# From project root
npm run dev:mobile

# Or from mobile directory
cd mobile
npm start
```

This will start the Metro bundler. You can then:

- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your physical device

#### Platform-Specific

```bash
# Android
npm run mobile:android

# iOS (macOS only)
npm run mobile:ios
```

## 📱 Building for Production

### Using EAS Build (Recommended - No Mac Required for iOS!)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS:
```bash
cd mobile
eas build:configure
```

4. Build for iOS (cloud build, no Mac needed):
```bash
eas build --platform ios
```

5. Build for Android:
```bash
eas build --platform android
```

### Local Build (Requires Native Tools)

```bash
# Generate native projects
npm run prebuild

# Build with Xcode (iOS - macOS only) or Android Studio
```

## 🏗️ Project Structure

```
mobile/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Home screen
│   ├── journal.tsx        # Journal screen
│   └── auth.tsx           # Authentication screen
├── src/
│   ├── components/        # Reusable components (coming soon)
│   ├── hooks/            # Custom hooks (coming soon)
│   └── config/           # Configuration files (coming soon)
├── assets/               # Images, fonts, etc.
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## 🔗 Shared Code

This mobile app shares code with the web frontend through the `shared/` directory:

- **Types**: `@shared/types/*` - TypeScript interfaces
- **Utils**: `@shared/utils/*` - Helper functions (levelSystem, rankSystem, date utils)
- **Services**: `@shared/services/*` - API service layer (coming soon)

Example:
```typescript
import { levelFromTotalXp } from '@shared/utils/levelSystem';
import type { UserClient } from '@shared/types/user';
```

## 📦 Key Dependencies

- **expo**: ~52.0.0 - Expo SDK
- **expo-router**: ~4.0.0 - File-based routing
- **react-native**: 0.76.5 - React Native framework
- **date-fns**: ^3.0.0 - Date utilities (shared with web)

### Coming Soon

- Firebase SDK for authentication and Firestore
- React Native Paper or NativeBase for UI components
- React Native Reanimated for animations
- AsyncStorage for local persistence

## 🎯 Current Status

### ✅ Completed

- [x] Basic Expo app structure
- [x] Expo Router configuration
- [x] Home screen with feature cards
- [x] Journal screen UI (placeholder)
- [x] Auth screen UI (placeholder)
- [x] Shared code integration (@shared path alias)
- [x] Monorepo setup

### 🚧 In Progress

- [ ] Firebase integration (Auth, Firestore)
- [ ] API service layer integration
- [ ] State management (Context API)
- [ ] Real journal entry saving
- [ ] User authentication flow

### 📋 Todo

- [ ] Tasks screen
- [ ] Habits screen
- [ ] Sunday AI chat screen
- [ ] Profile screen
- [ ] Community screen
- [ ] Pet screen
- [ ] Meditation screen
- [ ] Push notifications
- [ ] Offline support
- [ ] App icons and splash screens

## 🔥 Firebase Setup

### Web SDK Configuration (Coming Soon)

Create `mobile/src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  // Your Firebase config from Firebase Console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
```

## 🎨 Styling

Currently using React Native StyleSheet. Consider adding:

- **NativeWind** (Tailwind for React Native)
- **React Native Paper** (Material Design components)
- **React Native Elements**

## 🐛 Troubleshooting

### Module resolution errors

If you see errors about `@shared` imports:

1. Clear Metro bundler cache:
```bash
npx expo start --clear
```

2. Ensure babel-plugin-module-resolver is installed:
```bash
npm install --save-dev babel-plugin-module-resolver
```

### iOS build issues

- Make sure you're using EAS Build for cloud builds
- For local builds, you need macOS and Xcode

### Android build issues

- Ensure Android Studio and SDK are installed
- Check Java version (Java 17 recommended)

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Firebase for React Native](https://rnfirebase.io/)

## 🤝 Contributing

This is the mobile companion to the JournalXP web app. For shared functionality:

1. Add shared types to `shared/types/`
2. Add shared utilities to `shared/utils/`
3. Keep business logic platform-agnostic
4. UI components are platform-specific

## 📄 License

MIT - See LICENSE file in project root
