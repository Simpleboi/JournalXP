# JournalXP Mobile Development Guide

This guide covers building and deploying JournalXP as native iOS and Android apps using Capacitor.

## Prerequisites

### For Android Development
- **Android Studio** (latest version)
  - Download: https://developer.android.com/studio
- **Java Development Kit (JDK)** 17 or higher
- **Android SDK** (installed via Android Studio)

### For iOS Development (macOS only)
- **Xcode** 14+ (from Mac App Store)
- **CocoaPods** (`sudo gem install cocoapods`)
- **Xcode Command Line Tools** (`xcode-select --install`)
- **Apple Developer Account** (for App Store deployment)

## Quick Start

### 1. Build the Web App

```bash
# From frontend directory
npm run build
```

This creates the production build in `dist/` directory that Capacitor will use.

### 2. Sync Changes to Native Projects

After any code changes, rebuild and sync:

```bash
npm run build
npx cap sync
```

This copies web assets and updates native dependencies.

### 3. Open Native IDEs

**Android:**
```bash
npx cap open android
```

**iOS (macOS only):**
```bash
npx cap open ios
```

### 4. Run on Device/Emulator

- **Android**: Click "Run" (▶️) in Android Studio
- **iOS**: Click "Run" (▶️) in Xcode

## Development Workflow

### Live Reload During Development

For the best development experience with live reload:

1. Start your Vite dev server:
   ```bash
   npm run dev
   ```

2. Find your local IP address:
   ```bash
   # Windows
   ipconfig
   # macOS/Linux
   ifconfig
   ```

3. Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://YOUR_LOCAL_IP:5173',
     cleartext: true
   }
   ```

4. Run `npx cap sync` and relaunch the app

5. **Important**: Remove or comment out the `server` config before production builds!

### Testing on Physical Devices

**Android:**
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Select your device in Android Studio

**iOS:**
1. Connect iPhone/iPad via USB
2. Select device in Xcode
3. First time: Trust the developer certificate on device

## Available Capacitor Plugins

JournalXP includes these Capacitor plugins:

### Core Plugins (Already Installed)

- **@capacitor/status-bar** - Customize status bar appearance
- **@capacitor/keyboard** - Handle keyboard behavior
- **@capacitor/splash-screen** - Control splash screen
- **@capacitor/haptics** - Provide haptic feedback
- **@capacitor/local-notifications** - Schedule local notifications
- **@capacitor/app** - App lifecycle and state management

### Using Plugins in Your Code

Example: Add haptic feedback to button taps

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const handleButtonPress = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
  // Your button logic
};
```

Example: Check if running on native platform

```typescript
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  // Code for mobile only
} else {
  // Code for web only
}
```

Example: Local notifications for daily journaling reminders

```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

// Request permission
await LocalNotifications.requestPermissions();

// Schedule daily reminder
await LocalNotifications.schedule({
  notifications: [
    {
      title: "Time to journal!",
      body: "Take a moment to reflect on your day",
      id: 1,
      schedule: {
        on: { hour: 20, minute: 0 },
        repeats: true
      },
    }
  ]
});
```

## Useful Commands

```bash
# Build web app
npm run build

# Sync web assets to native projects
npx cap sync

# Sync only to Android
npx cap sync android

# Sync only to iOS
npx cap sync ios

# Copy web assets (without updating dependencies)
npx cap copy

# Update native dependencies
npx cap update

# Open Android Studio
npx cap open android

# Open Xcode
npx cap open ios

# Run on Android
npx cap run android

# Run on iOS (macOS only)
npx cap run ios

# Run with live reload (requires server config in capacitor.config.ts)
npx cap run android -l --external
npx cap run ios -l --external
```

## Building for Production

### Android Release Build

1. **Generate Keystore** (first time only):
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Update `capacitor.config.ts`**:
   ```typescript
   android: {
     buildOptions: {
       keystorePath: 'path/to/my-release-key.keystore',
       keystoreAlias: 'my-key-alias',
     },
   }
   ```

3. **Build Release APK/AAB**:
   - Open Android Studio
   - Build → Generate Signed Bundle / APK
   - Select "Android App Bundle" (recommended for Play Store)
   - Follow signing wizard

### iOS Release Build

1. **Configure Signing**:
   - Open project in Xcode
   - Select "App" target
   - Signing & Capabilities → Select your team
   - Xcode will auto-manage provisioning profiles

2. **Create Archive**:
   - Product → Archive
   - Wait for archive to complete
   - Organizer window opens

3. **Distribute**:
   - Select archive → Distribute App
   - Choose App Store Connect
   - Follow upload wizard

## App Icons & Splash Screens

### Quick Setup with Capacitor Assets

1. **Install the official assets tool**:
   ```bash
   npm install -D @capacitor/assets
   ```

2. **Prepare your source images**:
   - Create `resources/` folder in frontend directory
   - Add `icon.png` (1024x1024px, PNG with transparency)
   - Add `splash.png` (2732x2732px, PNG)

3. **Generate all sizes**:
   ```bash
   npx capacitor-assets generate
   ```

This automatically generates all required icon and splash screen sizes for both platforms.

### Manual Setup

If you prefer manual setup:

**Android:**
- Place icons in `android/app/src/main/res/mipmap-*/` folders
- Splash screens in `android/app/src/main/res/drawable-*/`

**iOS:**
- Open Xcode → App → Assets.xcassets
- Drag icons into AppIcon
- Splash screens into LaunchImage

## Troubleshooting

### Build Fails After Code Changes

```bash
# Clean and rebuild
npm run build
npx cap sync
# Then rebuild in IDE
```

### Android: Gradle Build Fails

```bash
# In android/ directory
./gradlew clean
# Then rebuild in Android Studio
```

### iOS: CocoaPods Issues

```bash
# In ios/App/ directory
pod deintegrate
pod install
```

### Changes Not Appearing in App

Make sure you:
1. Built the web app (`npm run build`)
2. Synced with Capacitor (`npx cap sync`)
3. Restarted the native app (not just hot reload)

### Firebase Not Working on Mobile

The Firebase Web SDK works out of the box with Capacitor. Ensure:
- `firebase.ts` initializes correctly
- API calls use full URLs (check `authFetch` in `lib/authFetch.ts`)
- CORS is properly configured on your backend

### Deep Linking / Custom URL Schemes

To handle links like `journalxp://`:

1. Update `capacitor.config.ts`:
   ```typescript
   appId: 'com.journalxp.app',
   server: {
     androidScheme: 'https'  // or 'http' for dev
   }
   ```

2. Configure in native projects (see Capacitor docs)

## Performance Optimization

### Bundle Size

Your app includes the entire web bundle. To reduce size:

1. **Code splitting**: Already configured with Vite
2. **Lazy load routes**: Use React.lazy() for route components
3. **Tree shaking**: Remove unused dependencies
4. **Image optimization**: Compress images before bundling

### Native Performance

- Use `Capacitor.isNativePlatform()` to conditionally load features
- Leverage native plugins instead of web alternatives where possible
- Minimize DOM updates in lists (virtualization)

## App Store Deployment

### Google Play Store

1. Create app in Google Play Console
2. Upload AAB (Android App Bundle)
3. Complete store listing
4. Submit for review

**Requirements:**
- Privacy Policy URL
- App screenshots (phone + tablet)
- Feature graphic (1024x500px)
- App description

### Apple App Store

1. Create app in App Store Connect
2. Upload via Xcode Organizer
3. Complete App Information
4. Submit for review

**Requirements:**
- Privacy Policy URL
- Screenshots for all device sizes
- App description and keywords
- App Store icon (1024x1024px)

## Recommended Plugins to Add

Consider adding these plugins for enhanced functionality:

```bash
# Camera access for profile pictures
npm install @capacitor/camera

# Share functionality for journal entries
npm install @capacitor/share

# Secure storage for sensitive data
npm install @capacitor/preferences

# Biometric authentication (Face ID, Fingerprint)
npm install @capacitor-community/biometric-auth

# Background tasks
npm install @capacitor/background-runner
```

## Next Steps

1. ✅ Capacitor is now set up!
2. Test the app in Android Studio / Xcode
3. Implement platform-specific features using plugins
4. Generate app icons and splash screens
5. Test on physical devices
6. Prepare for app store submission

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

**Questions or Issues?**

- Capacitor Discord: https://discord.gg/UPYYRhtyzp
- Stack Overflow: Tag with `capacitor`
