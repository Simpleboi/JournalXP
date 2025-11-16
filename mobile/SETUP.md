# Mobile App Setup Guide

This guide will walk you through setting up the JournalXP mobile app from scratch.

## Prerequisites

- Node.js 18+ installed
- Git
- A smartphone (iOS or Android) with Expo Go app installed
  - [Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)
  - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- Firebase project credentials

## Step 1: Install Dependencies

From the project root:

```bash
npm install
```

This will install dependencies for all workspaces (frontend, mobile, functions, shared).

Or install just mobile dependencies:

```bash
cd mobile
npm install
```

## Step 2: Configure Firebase

### 2.1 Install Firebase packages

```bash
cd mobile
npm install firebase @react-native-async-storage/async-storage
```

### 2.2 Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your JournalXP project (or create one if it doesn't exist)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps"
5. Click "Add app" > Web (</> icon)
6. Register app with nickname "JournalXP Mobile"
7. Copy the `firebaseConfig` object

### 2.3 Update Firebase Config

Open `mobile/src/config/firebase.ts` and:

1. Uncomment all the commented code
2. Replace the placeholder `firebaseConfig` with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "AIza...", // Your actual API key
  authDomain: "journalxp-xxxxx.firebaseapp.com",
  projectId: "journalxp-xxxxx",
  storageBucket: "journalxp-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

### 2.4 Update authFetch.ts

Open `mobile/src/lib/authFetch.ts` and uncomment the Firebase import:

```typescript
import { getAuth } from 'firebase/auth';
```

Then in the `authFetch` function, uncomment:

```typescript
const auth = getAuth();
const token = await auth.currentUser?.getIdToken(true);
```

And remove the placeholder:

```typescript
// Remove this line:
const token = null;
```

## Step 3: Add App Icons and Splash Screen

Create placeholder assets or use your own:

```bash
cd mobile/assets
```

Create these files (you can use any image editor or online tools):

- `icon.png` - 1024x1024 app icon
- `splash.png` - 1284x2778 splash screen
- `adaptive-icon.png` - 1024x1024 Android adaptive icon
- `favicon.png` - 48x48 favicon for web

### Quick placeholders:

For now, you can use simple colored squares. We'll replace them later with actual branding.

## Step 4: Run the App

### Start Metro bundler:

From project root:
```bash
npm run dev:mobile
```

Or from mobile directory:
```bash
cd mobile
npm start
```

This will show a QR code in your terminal.

### Open on your device:

1. **iOS**: Open Camera app, scan QR code, tap notification
2. **Android**: Open Expo Go app, scan QR code

### Or use a simulator:

- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator

## Step 5: Test the App

1. You should see the JournalXP home screen
2. Tap "Journal" card
3. Fill in the form (note: saving won't work until auth is set up)
4. The UI should be fully functional

## Step 6: Set Up Authentication (Next Steps)

### 6.1 Create Auth Context

Create `mobile/src/context/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 6.2 Wrap app with AuthProvider

Update `mobile/app/_layout.tsx`:

```typescript
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* existing Stack code */}
      </SafeAreaProvider>
    </AuthProvider>
  );
}
```

### 6.3 Implement Sign In/Sign Up

Update `mobile/app/auth.tsx` to use Firebase Auth:

```typescript
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebase';

// In handleAuth function:
try {
  if (isSignUp) {
    await createUserWithEmailAndPassword(auth, email, password);
  } else {
    await signInWithEmailAndPassword(auth, email, password);
  }
  router.replace('/');
} catch (error: any) {
  Alert.alert('Error', error.message);
}
```

## Step 7: Test Full Flow

1. Open the app
2. Navigate to auth screen
3. Sign up with email/password
4. Should redirect to home
5. Navigate to Journal
6. Create a journal entry
7. Should save successfully and award 30 XP!

## Troubleshooting

### "Cannot find module '@shared/...'"

Clear Metro cache:
```bash
npx expo start --clear
```

### Firebase auth errors

Make sure:
1. Firebase config is correct
2. Email/Password auth is enabled in Firebase Console > Authentication > Sign-in methods
3. You're using the same Firebase project as your web app

### "Invariant Violation: Module AppRegistry is not a registered callable module"

Clear node_modules and reinstall:
```bash
cd mobile
rm -rf node_modules
npm install
```

### Expo Go not connecting

1. Ensure phone and computer are on same WiFi
2. Try using tunnel mode: `npx expo start --tunnel`
3. Update Expo Go app to latest version

## Building for Production

See the main README.md for EAS Build instructions to create standalone apps without needing a Mac for iOS!

## Next Steps

- [ ] Implement all auth screens (sign up, sign in, forgot password)
- [ ] Add user profile screen
- [ ] Implement tasks, habits, and other features
- [ ] Add push notifications for daily reminders
- [ ] Style improvements with NativeWind or React Native Paper
- [ ] Add animations with React Native Reanimated
- [ ] Implement offline support with AsyncStorage

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Firebase for React Native](https://firebase.google.com/docs/web/setup)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
