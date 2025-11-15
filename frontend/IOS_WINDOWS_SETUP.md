# iOS Testing on Windows with Physical iPhone

This guide shows you how to develop JournalXP on Windows and test on your real iPhone using live reload.

## Overview

**What you'll do:**
1. Use a cloud Mac service for initial iOS build (one-time, ~1 hour)
2. Install app on your iPhone via Xcode
3. Develop on Windows with instant preview on iPhone
4. Only use cloud Mac again when submitting to App Store

**Cost**: ~$1-3 for initial setup, then free daily development!

---

## Part 1: Initial iOS Build (Cloud Mac Service)

### Step 1: Choose a Cloud Mac Service

**Recommended: MacinCloud Pay-As-You-Go**
- Website: https://www.macincloud.com/
- Plan: Pay-As-You-Go Server ($1-3/hour)
- What you need: 1-2 hours for initial setup

**Alternative: MacStadium**
- Website: https://www.macstadium.com/
- Cost: Higher but more reliable

### Step 2: Sign Up and Access Cloud Mac

1. **Create account** on MacinCloud
2. **Purchase credits** ($10 minimum, gives you ~3-5 hours)
3. **Launch a server**:
   - Select: macOS Sonoma or later
   - Plan: Pay-As-You-Go
   - Click "Start Server"
4. **Connect via Remote Desktop**:
   - Download RDP file or use browser-based access
   - Login with provided credentials

### Step 3: Prepare Your iPhone

**Before connecting to cloud Mac:**

1. **Get your Apple ID ready**
   - You'll need it to sign in to Xcode

2. **Enable Developer Mode on iPhone**:
   - Settings → Privacy & Security → Developer Mode
   - Toggle it ON
   - iPhone will restart

3. **Have a USB cable ready**
   - You'll connect iPhone to your Windows PC, not the cloud Mac
   - We'll use wireless debugging instead

### Step 4: Setup Development Environment on Cloud Mac

**On the cloud Mac:**

1. **Install Xcode** (if not already installed):
   - Open App Store
   - Search "Xcode"
   - Click "Get" / "Install" (15-20 min download)
   - Open Xcode once to accept license agreement

2. **Install Homebrew**:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Install Node.js**:
   ```bash
   brew install node
   ```

4. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

### Step 5: Transfer Your Project to Cloud Mac

**Option A: Via Git (Recommended)**

On cloud Mac terminal:
```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/JournalXP.git
cd JournalXP/frontend

# Install dependencies
npm install --legacy-peer-deps

# Build the web app
npm run build

# Sync to iOS
npx cap sync ios
```

**Option B: Via File Transfer**

1. On Windows, zip your entire JournalXP folder
2. Upload to cloud storage (Google Drive, Dropbox)
3. Download on cloud Mac
4. Extract and run the commands above

### Step 6: Configure for Your iPhone

**On cloud Mac, edit `capacitor.config.ts`:**

```typescript
server: {
  // Add your Windows PC's local IP address
  // We'll get this in Part 2
  url: 'http://YOUR_WINDOWS_IP:5173',
  cleartext: true
},
```

**Important**: We need to set this BEFORE building, so the app knows where to load from.

### Step 7: Build and Install on iPhone

**Connect iPhone to Cloud Mac:**

Since you can't physically plug into cloud Mac, use **WiFi pairing**:

1. **On your Windows PC**:
   - Install iTunes: https://www.apple.com/itunes/download/
   - Connect iPhone via USB
   - Open iTunes
   - Click your device
   - Check "Sync with this iPhone over Wi-Fi"
   - Note your iPhone's IP address (Settings → Wi-Fi → ⓘ → IP Address)

2. **On Cloud Mac in Xcode**:
   ```bash
   # Open the iOS project
   cd frontend
   npx cap open ios
   ```

3. **In Xcode**:
   - Sign in with your Apple ID:
     - Xcode → Settings → Accounts → Add (+)
     - Sign in with your Apple ID

   - Select the "App" target (left sidebar)
   - Go to "Signing & Capabilities" tab
   - Team: Select your Apple ID
   - Bundle Identifier: Should be `com.journalxp.app`
   - Xcode will auto-manage signing

   - **Add your iPhone**:
     - Window → Devices and Simulators
     - Click "+" → Enter iPhone IP address
     - Pair with code shown on iPhone

   - **Select your iPhone** in device dropdown (top bar)

   - **Click Run (▶️)**

   - **On iPhone**:
     - Settings → General → VPN & Device Management
     - Tap your Apple ID
     - Tap "Trust"

   - **App installs and launches!**

4. **First launch will fail** - that's expected! It's trying to connect to your Windows dev server.

### Step 8: Stop the Cloud Mac Server

**You're done with the cloud Mac!**
- File → Quit Xcode
- Stop the server in MacinCloud dashboard
- You'll only need it again for App Store builds

**Cost so far**: ~$1-3 for 1-2 hours

---

## Part 2: Daily Development on Windows

Now the magic happens - develop on Windows, test on iPhone!

### Step 1: Get Your Windows IP Address

```bash
ipconfig
```

Look for "IPv4 Address" under your active connection (WiFi or Ethernet).
Example: `192.168.1.100`

**Important**:
- Use local network IP (192.168.x.x or 10.x.x.x)
- Your iPhone must be on the SAME WiFi network
- Router must allow device-to-device communication

### Step 2: Configure Live Reload

**Edit `frontend/capacitor.config.ts`:**

```typescript
server: {
  url: 'http://192.168.1.100:5173',  // YOUR Windows IP
  cleartext: true
},
```

**Save this file** - commit it to git if you want, or keep it local.

### Step 3: Start Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.1.10  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### Step 4: Open App on iPhone

1. **Make sure iPhone is on same WiFi**
2. **Open JournalXP app** (the one you installed from Xcode)
3. **It loads from your Windows dev server!**

### Step 5: Make Changes and See Them Instantly

1. Edit any file in `frontend/src/`
2. Save
3. **Watch it update on your iPhone immediately!**

**Example**:
- Edit `frontend/src/pages/Home.tsx`
- Add some text
- Save
- iPhone updates in < 1 second

---

## Daily Workflow

### Starting Your Day

```bash
# 1. Make sure iPhone is on same WiFi as Windows PC
# 2. Start dev server
cd frontend
npm run dev

# 3. Open JournalXP app on iPhone
# 4. Start coding!
```

### Making Changes

```bash
# Edit files in frontend/src/
# Save
# Changes appear on iPhone instantly
```

### Testing Different Features

- **Journal entry**: Type on iPhone keyboard
- **Sunday AI chat**: Test actual voice input
- **Habits/Tasks**: Test touch interactions
- **Pet interactions**: Test gestures and animations
- **Community**: Test scrolling and comments

### When You're Done

```bash
# Stop dev server (Ctrl+C)
```

**Note**: App on iPhone will show "Cannot connect to server" when dev server is off. That's normal!

---

## Part 3: Building for Production (No Live Reload)

When you want to test the "real" app without dev server:

### Option A: Quick Method (No Cloud Mac Needed)

**If you only changed web code (frontend/src/):**

Unfortunately, you'll need the cloud Mac again to rebuild. There's no way around this with iOS.

### Option B: Use Cloud Mac Again

1. **Start cloud Mac server**
2. **Pull latest code** from Git
3. **Rebuild**:
   ```bash
   cd JournalXP/frontend
   npm run build
   npx cap sync ios
   npx cap open ios
   ```
4. **Click Run in Xcode**
5. **New version installs on iPhone**
6. **Stop cloud Mac server**

**Cost**: ~$1-2 per rebuild session

---

## Troubleshooting

### "Cannot connect to dev server" on iPhone

**Check**:
1. Is dev server running? (`npm run dev`)
2. Is iPhone on same WiFi as Windows PC?
3. Is IP address correct in `capacitor.config.ts`?
4. Can you access `http://YOUR_IP:5173` in iPhone Safari?

**Fix**:
```bash
# On Windows, allow port 5173 through firewall:
# Control Panel → Windows Defender Firewall → Advanced Settings
# → Inbound Rules → New Rule → Port → TCP → 5173 → Allow
```

### "Trust App Developer" error

**Fix**:
- iPhone Settings → General → VPN & Device Management
- Tap your Apple ID under Developer App
- Tap "Trust"

### App crashes immediately

**Possible causes**:
1. Firebase config issue
2. Build failed (check Xcode logs)
3. iOS version incompatibility

**Check Xcode console** on cloud Mac for errors

### IP Address keeps changing

**Fix: Set static IP on Windows**:
1. Control Panel → Network and Sharing Center
2. Change adapter settings → Right-click WiFi → Properties
3. Internet Protocol Version 4 → Properties
4. Use the following IP address: (set static IP like 192.168.1.100)

### Router blocks device-to-device communication

**Fix**:
- Check router settings for "AP Isolation" or "Client Isolation"
- Disable it (often found in guest network settings)
- Or use mobile hotspot from iPhone instead

---

## Cost Breakdown

### Initial Setup
- Cloud Mac rental: $1-3 (1-2 hours)
- Apple Developer Account: FREE for testing (no App Store submission)

### Daily Development
- **$0** - Develop on Windows, test on iPhone via WiFi

### Rebuilding App (Occasional)
- Cloud Mac rental: $1-2 per session
- Frequency: Only when you change native config or need production build

### App Store Submission (Future)
- Apple Developer Program: $99/year (required)
- Cloud Mac rental: $3-5 for submission process

**Total for first 6 months of development**: ~$10-20

---

## When You Need Cloud Mac Again

**You DON'T need it for:**
- ✅ Daily development (use live reload)
- ✅ Changing React code
- ✅ Updating styles
- ✅ Adding new pages/features
- ✅ Testing on iPhone

**You DO need it for:**
- ❌ Initial build and installation
- ❌ Changing Capacitor plugins
- ❌ Updating `capacitor.config.ts` native settings
- ❌ Changing app permissions (Info.plist)
- ❌ Creating production builds
- ❌ App Store submission

**Frequency**: Initial build + maybe 2-3 times during development + App Store submission

---

## Advanced: Using GitHub for Easy Cloud Mac Access

**Make it easier to sync code:**

1. **Commit your code on Windows**:
   ```bash
   git add .
   git commit -m "Latest changes"
   git push
   ```

2. **On cloud Mac**:
   ```bash
   git pull
   npm run build
   npx cap sync ios
   # Rebuild in Xcode
   ```

This way you don't need to transfer files manually!

---

## Next Steps

### Immediate
1. ✅ Sign up for MacinCloud
2. ✅ Follow Part 1 to build and install on iPhone
3. ✅ Configure live reload (Part 2)
4. ✅ Start developing with instant iPhone preview!

### Soon
- Test all features on real iPhone
- Add iOS-specific features (haptics, notifications)
- Get feedback from iPhone users

### Future
- Consider buying a used Mac Mini ($300-500) if you build often
- Or keep using cloud Mac pay-as-you-go ($1-3 per session)

---

## Tips for Success

### Save Money
- **Do all native work in one session**: Update plugins, config, rebuild
- **Commit before cloud Mac sessions**: Pull from Git, don't upload files
- **Stop server immediately**: Don't leave cloud Mac running

### Optimize Workflow
- Keep a checklist of what needs cloud Mac vs. what doesn't
- Use Git tags for iOS builds: `git tag ios-v1.0.0`
- Document any iOS-specific setup in this file

### Best Practices
- **Always test on real iPhone**: Simulators behave differently
- **Test on WiFi AND cellular**: Different network conditions
- **Test with low battery mode**: Affects performance
- **Test notifications**: Must be on physical device

---

## Questions?

- MacinCloud support: https://www.macincloud.com/support
- Capacitor iOS issues: https://capacitorjs.com/docs/ios
- Xcode help: https://developer.apple.com/xcode/

**Ready to start?** Follow Part 1 to get your first iOS build running!
