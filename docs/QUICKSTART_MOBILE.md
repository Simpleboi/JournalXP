# Quick Start: Mobile App Development

Get the JournalXP mobile app running in **5 minutes**! ⚡

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ A smartphone with Expo Go app installed
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 1: Install Dependencies (2 min)

```bash
# From project root
npm install

# This installs dependencies for all workspaces:
# - frontend (web app)
# - mobile (Expo app)
# - functions (backend)
# - shared (common code)
```

## Step 2: Start the Mobile App (1 min)

```bash
# From project root
npm run dev:mobile

# OR from mobile directory
cd mobile
npm start
```

This will:
1. Start the Metro bundler
2. Show a QR code in your terminal
3. Display a menu of options

## Step 3: Open on Your Phone (1 min)

### iPhone:
1. Open **Camera** app
2. Point at QR code
3. Tap the notification
4. Expo Go will open

### Android:
1. Open **Expo Go** app
2. Tap "Scan QR code"
3. Point at QR code
4. App will load

## Step 4: Explore the App (1 min)

You should see:
- ✅ JournalXP home screen with feature cards
- ✅ Journal screen (tap the Journal card)
- ✅ Mood selection and text input
- ⚠️ Saving won't work yet (need Firebase setup)

## What's Working Now?

| Feature | Status | Notes |
|---------|--------|-------|
| UI/Navigation | ✅ Working | Expo Router is configured |
| Home Screen | ✅ Working | Shows feature cards |
| Journal UI | ✅ Working | Full form layout |
| Auth UI | ✅ Working | Sign in/sign up screens |
| Shared Code | ✅ Working | Types, utils from `@shared` |
| Firebase | ⚠️ Not configured | Need to set up |
| API Calls | ⚠️ Not configured | Need auth tokens |
| Data Saving | ⚠️ Not configured | Need Firebase + auth |

## Next Steps

### To Enable Full Functionality:

1. **Set up Firebase** (5-10 min)
   - See `mobile/SETUP.md` for detailed instructions
   - Install Firebase packages
   - Add your Firebase config

2. **Test Authentication** (2 min)
   - Sign up with email/password
   - Sign in
   - Session management

3. **Test Journal Saving** (1 min)
   - Create journal entry
   - Should save to Firestore
   - Should award 30 XP

### To Build More Features:

See `ARCHITECTURE.md` for the full development guide.

## Development Tips

### Hot Reload

Changes to your code will automatically reload in the app:
- ✅ Component changes
- ✅ Shared code changes
- ✅ Style changes

Just save the file and the app updates!

### Debugging

Press `m` in the terminal to open the developer menu, or shake your phone.

Options:
- **Reload** - Refresh the app
- **Debug Remote JS** - Use Chrome DevTools
- **Show Inspector** - Inspect elements
- **Show Performance Monitor** - Check FPS

### Logs

Watch the terminal where you ran `npm run dev:mobile` to see:
- `console.log()` output
- Error messages
- Network requests

### Clear Cache

If things get weird:

```bash
npx expo start --clear
```

## Common Issues

### QR Code Won't Scan

1. Make sure phone and computer are on **same WiFi network**
2. Try tunnel mode: `npx expo start --tunnel`
3. Try typing the URL manually in Expo Go

### "Cannot find module '@shared/...'"

```bash
# Clear Metro cache
npx expo start --clear
```

### App Crashes on Launch

1. Check terminal for error messages
2. Make sure all dependencies are installed
3. Try deleting `node_modules` and reinstalling:
   ```bash
   cd mobile
   rm -rf node_modules
   npm install
   ```

### Changes Not Appearing

1. Make sure Fast Refresh is enabled (it is by default)
2. Try shaking your phone and tapping "Reload"
3. Try `npx expo start --clear`

## File Structure Quick Reference

```
mobile/
├── app/                    # 📱 Screens (Expo Router)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home screen
│   ├── journal.tsx         # Journal screen
│   └── auth.tsx            # Auth screen
│
├── src/
│   ├── components/         # 🧩 Reusable components (empty for now)
│   ├── config/             # ⚙️  Configuration
│   │   └── firebase.ts     # Firebase config (needs setup)
│   ├── lib/                # 🛠️  Utilities
│   │   └── authFetch.ts    # API fetch wrapper
│   └── services/           # 🔌 API services
│       └── journalService.ts
│
└── assets/                 # 🎨 Images, icons (needs assets)
```

## NPM Scripts Reference

From project root:

```bash
npm run dev:web           # Start web app (http://localhost:5173)
npm run dev:mobile        # Start mobile app (Expo)
npm run dev:functions     # Start backend emulator
npm run build:web         # Build web app
npm run build:mobile      # Build mobile app
npm run deploy            # Deploy everything
```

From mobile directory:

```bash
npm start                 # Start Expo
npm run android          # Start on Android
npm run ios              # Start on iOS simulator (macOS only)
```

## Platform Comparison

| | Web App | Mobile App |
|---|---------|------------|
| Framework | React + Vite | React Native + Expo |
| Routing | React Router | Expo Router |
| Styling | TailwindCSS | StyleSheet |
| Components | Radix UI | React Native |
| Auth | Firebase Web SDK | Firebase RN SDK |
| Backend | ✅ Same API | ✅ Same API |
| Database | ✅ Same Firestore | ✅ Same Firestore |
| XP System | ✅ Shared logic | ✅ Shared logic |

## What Makes This Special?

🎯 **Hybrid Architecture**
- Web and mobile apps share 40-50% of code
- Same backend, business logic, and database
- Platform-specific UI for best experience

🚀 **No Mac Required for iOS**
- Use Expo EAS Build to build iOS apps in the cloud
- Test on physical iPhone with Expo Go
- Deploy to App Store from Windows/Linux

🔥 **Best of Both Worlds**
- Optimized web experience
- Native mobile experience
- Single codebase for shared logic

## Ready to Code?

1. ✅ Mobile app is running on your phone
2. 📚 Read `mobile/SETUP.md` for Firebase setup
3. 🏗️  Read `ARCHITECTURE.md` for architecture details
4. 💻 Start building features!

## Need Help?

- **Mobile Setup**: See `mobile/SETUP.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Project Overview**: See `CLAUDE.md`
- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/

Happy coding! 🎉
