# iPhone Testing Quick Start

**TL;DR: Use cloud Mac once to install app on iPhone, then develop on Windows with live reload!**

---

## 🚀 One-Time Setup (Cloud Mac)

### 1. Sign up for MacinCloud
- https://www.macincloud.com/
- Choose "Pay-As-You-Go" plan
- Add $10 credit (~3-5 hours)

### 2. On Cloud Mac
```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/JournalXP.git
cd JournalXP/frontend

# Install & build
npm install --legacy-peer-deps
npm run build

# Get your Windows IP first!
# On Windows: run "ipconfig" → note IPv4 address

# Edit capacitor.config.ts:
# Uncomment and set: url: 'http://YOUR_WINDOWS_IP:5173'

# Sync to iOS
npx cap sync ios
npx cap open ios
```

### 3. In Xcode
- Sign in with Apple ID (Xcode → Settings → Accounts)
- Select "App" target → Signing & Capabilities
- Team: Your Apple ID
- Connect iPhone via WiFi (Window → Devices → Add)
- Select iPhone in device dropdown
- Click Run (▶️)
- On iPhone: Settings → General → Device Management → Trust

### 4. Stop Cloud Mac
**You're done! App is on your iPhone.**

**Cost: ~$1-3 for 1-2 hours**

---

## 💻 Daily Development (Windows)

### Every Day
```bash
# 1. Get Windows IP
ipconfig

# 2. Edit frontend/capacitor.config.ts
# Uncomment and set:
server: {
  url: 'http://YOUR_IP:5173',
  cleartext: true
}

# 3. Ensure iPhone on same WiFi

# 4. Start dev server
cd frontend
npm run dev

# 5. Open JournalXP app on iPhone
# 6. Code changes appear instantly!
```

---

## 📝 Workflow

### Make Changes
1. Edit files in `frontend/src/`
2. Save
3. **iPhone updates automatically** ✨

### Test Features
- Journal entries
- Sunday AI chat
- Habits & tasks
- Pet interactions
- Community posts

### Done for the day
```bash
# Stop server (Ctrl+C)
```

---

## 🔧 Troubleshooting

### "Cannot connect to server"
```bash
# Check:
✓ Dev server running? (npm run dev)
✓ iPhone on same WiFi?
✓ IP correct in capacitor.config.ts?

# Fix firewall:
# Windows → Defender Firewall → Inbound Rules
# → New Rule → Port 5173 → Allow
```

### Can't trust app on iPhone
```
iPhone Settings → General
→ VPN & Device Management
→ Tap your Apple ID → Trust
```

### IP keeps changing
```
Set static IP on Windows:
Control Panel → Network Settings
→ WiFi Properties → IPv4
→ Set manual IP (e.g., 192.168.1.100)
```

---

## 📦 When to Use Cloud Mac Again

**DON'T need it for:**
- Daily development ✅
- Code changes ✅
- Testing on iPhone ✅

**DO need it for:**
- Adding Capacitor plugins ❌
- Changing native config ❌
- App Store builds ❌

**Frequency**: Maybe 2-3 times during development

---

## 💰 Cost Summary

| Task | Cost | Frequency |
|------|------|-----------|
| Initial setup | $1-3 | Once |
| Daily development | FREE | Every day |
| Rebuild app | $1-2 | Rare (2-3x) |
| App Store | $3-5 + $99/year | Once |

**Total first 6 months: ~$10-20**

---

## 🎯 Next Steps

1. ☐ Sign up for MacinCloud
2. ☐ Get Windows IP address (`ipconfig`)
3. ☐ Enable Developer Mode on iPhone
4. ☐ Follow One-Time Setup above
5. ☐ Start daily development!

---

**Full guide**: `IOS_WINDOWS_SETUP.md`
