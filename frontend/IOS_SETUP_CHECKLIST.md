# iPhone Testing Setup Checklist

Use this checklist to track your progress setting up iOS testing on Windows.

---

## ☐ Pre-Setup (Before Cloud Mac)

### Prepare Your Windows PC
- [ ] Get Windows IP address: `ipconfig` → Note IPv4: __________________
- [ ] Confirm iPhone and Windows on same WiFi network
- [ ] Allow port 5173 through Windows Firewall
  - [ ] Control Panel → Windows Defender Firewall → Advanced Settings
  - [ ] Inbound Rules → New Rule → Port → TCP → 5173 → Allow

### Prepare Your iPhone
- [ ] iOS version 14 or higher
- [ ] Settings → Privacy & Security → Developer Mode → ON (requires restart)
- [ ] Settings → Wi-Fi → Connected to same network as Windows
- [ ] Note iPhone's iOS version: __________________

### Prepare Your Apple Account
- [ ] Have Apple ID ready (email): __________________
- [ ] Have Apple ID password ready

### Prepare Your Code
- [ ] Latest code committed to Git
  ```bash
  git add .
  git commit -m "Ready for iOS build"
  git push
  ```
- [ ] GitHub repo URL: __________________
- [ ] Or: Upload project zip to cloud storage

---

## ☐ Cloud Mac Setup

### Account Creation
- [ ] Sign up at https://www.macincloud.com/
- [ ] Choose "Pay-As-You-Go" plan
- [ ] Add minimum $10 credit
- [ ] Start a macOS server (Sonoma or later)
- [ ] Download RDP connection file or note browser access URL

### Connect to Cloud Mac
- [ ] Open Remote Desktop connection
- [ ] Login successful
- [ ] Cloud Mac desktop visible

### Install Required Software
- [ ] Xcode installed (or install from App Store)
  - [ ] Open Xcode once to accept license
- [ ] Homebrew installed: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- [ ] Node.js installed: `brew install node`
- [ ] CocoaPods installed: `sudo gem install cocoapods`

---

## ☐ Build iOS App on Cloud Mac

### Get Your Code
- [ ] Clone from Git: `git clone YOUR_REPO_URL`
- [ ] OR: Download and extract zip file
- [ ] Navigate to project: `cd JournalXP/frontend`

### Configure for Live Reload
- [ ] Edit `capacitor.config.ts`
- [ ] Uncomment `url: 'http://YOUR_IP:5173'`
- [ ] Replace YOUR_IP with Windows IP: __________________
- [ ] Uncomment `cleartext: true`
- [ ] Save file

### Build the App
- [ ] Install dependencies: `npm install --legacy-peer-deps`
- [ ] Build web app: `npm run build`
- [ ] Sync to iOS: `npx cap sync ios`
- [ ] Open Xcode: `npx cap open ios`

### Configure Xcode Signing
- [ ] Xcode → Settings (Cmd+,) → Accounts → Add (+)
- [ ] Sign in with Apple ID
- [ ] Close Settings
- [ ] Select "App" target in left sidebar
- [ ] Go to "Signing & Capabilities" tab
- [ ] Team: Select your Apple ID from dropdown
- [ ] "Signing Certificate" should show your name

---

## ☐ Install App on iPhone

### Connect iPhone to Xcode
**Option A: WiFi Pairing (Recommended)**
- [ ] iPhone Settings → Wi-Fi → ⓘ → Note IP: __________________
- [ ] Xcode → Window → Devices and Simulators
- [ ] Click "+" button (bottom left)
- [ ] Enter iPhone IP address
- [ ] Click "Connect"
- [ ] Enter pairing code from iPhone screen
- [ ] iPhone appears in device list

**Option B: USB via iTunes (Alternative)**
- [ ] Install iTunes on Windows
- [ ] Connect iPhone to Windows via USB
- [ ] Open iTunes → Select device
- [ ] Enable "Sync with this iPhone over Wi-Fi"
- [ ] Try Option A above

### Build and Install
- [ ] In Xcode, select your iPhone from device dropdown (top bar, next to App ▶)
- [ ] Click Run button (▶) or press Cmd+R
- [ ] Wait for build to complete (2-5 minutes first time)
- [ ] App appears on iPhone home screen

### Trust Developer on iPhone
- [ ] Settings → General → VPN & Device Management
- [ ] Under "Developer App", tap your Apple ID
- [ ] Tap "Trust [Your Name]"
- [ ] Tap "Trust" in confirmation dialog

### Test Installation
- [ ] App launches on iPhone
- [ ] You see "Cannot connect to server" or loading screen (expected!)
- [ ] Don't worry - we'll fix this with Windows dev server next

---

## ☐ Cleanup Cloud Mac

### Stop Services
- [ ] Quit Xcode (Cmd+Q)
- [ ] Close terminal windows

### Stop Server
- [ ] Go to MacinCloud dashboard
- [ ] Click "Stop" on your server
- [ ] Confirm server is stopped

### Note Costs
- [ ] Time used: ________ hours
- [ ] Cost: $________
- [ ] Remaining credit: $________

---

## ☐ Windows Development Setup

### Verify Configuration
- [ ] `capacitor.config.ts` still has your Windows IP configured
- [ ] IP address matches: `ipconfig` output

### Test Firewall
- [ ] Windows Firewall allows port 5173
- [ ] Test: Open iPhone Safari → `http://YOUR_IP:5173`
- [ ] Should see "Cannot GET /" or Vite page (means port is open)

### Start Dev Server
- [ ] `cd frontend`
- [ ] `npm run dev`
- [ ] Server running on port 5173
- [ ] Shows network URL with your IP

### Test Live Reload
- [ ] iPhone on same WiFi as Windows
- [ ] Open JournalXP app on iPhone
- [ ] App loads and shows home screen ✨
- [ ] Make a test edit to `frontend/src/pages/Home.tsx`
- [ ] Save file
- [ ] iPhone updates within 1-2 seconds ✨

---

## ☐ Verify Everything Works

### Test Core Features on iPhone
- [ ] Login/Signup works
- [ ] Create journal entry
- [ ] Sunday AI chat works
- [ ] Habits page loads
- [ ] Daily tasks page loads
- [ ] Virtual pet page loads
- [ ] Community page loads
- [ ] Profile page loads
- [ ] Settings page loads

### Test Live Reload
- [ ] Edit a file in `frontend/src/`
- [ ] Save
- [ ] Change appears on iPhone within 2 seconds
- [ ] Hot reload works (page doesn't fully refresh)

### Test Development Workflow
- [ ] Stop dev server (Ctrl+C)
- [ ] App shows "Cannot connect" message
- [ ] Restart dev server (`npm run dev`)
- [ ] App reconnects and works again

---

## 🎉 Success!

### You Can Now:
✅ Develop on Windows
✅ Test on real iPhone instantly
✅ See changes in < 2 seconds
✅ Test touch, gestures, real performance
✅ Only need cloud Mac for rebuilds

### Next Steps:
- [ ] Read full workflow guide: `IOS_WINDOWS_SETUP.md`
- [ ] Test all app features thoroughly
- [ ] Add iOS-specific features (haptics, notifications)
- [ ] Build features and iterate rapidly

### When You Need Cloud Mac Again:
- Adding Capacitor plugins
- Changing native iOS settings
- Creating production build
- Submitting to App Store

**Estimated frequency: 2-3 times during development**

---

## 📝 Notes & Issues

Use this space to track any issues you encounter:

**Date**: ____________

**Issue**:

**Solution**:


**Date**: ____________

**Issue**:

**Solution**:


**Date**: ____________

**Issue**:

**Solution**:

---

## 📞 Support Resources

**Cloud Mac Issues:**
- MacinCloud Support: https://www.macincloud.com/support

**Capacitor Issues:**
- Docs: https://capacitorjs.com/docs/ios
- Discord: https://discord.gg/UPYYRhtyzp

**Xcode Issues:**
- Apple Developer: https://developer.apple.com/support/

**JournalXP Guides:**
- Quick Start: `IOS_QUICK_START.md`
- Full Guide: `IOS_WINDOWS_SETUP.md`
- Mobile Guide: `MOBILE.md`
