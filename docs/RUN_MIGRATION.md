# How to Run Migration - Quick Guide

You have multiple options. Choose the easiest one for your situation.

---

## ⚡ Option 1: Use API Endpoint (Recommended - No Credentials Needed!)

This works with your running emulator and doesn't need service account credentials.

### Step 1: Make sure emulator is running
```bash
npm run emulators
```

### Step 2: Check what needs migration
```bash
curl "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/status"
```

### Step 3: Run migration
```bash
curl -X POST "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/user-fields?key=migrate-123"
```

### Step 4: Verify
```bash
curl "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/status"
```

**✅ DONE! This is the easiest way.**

---

## 🔧 Option 2: CLI Script with Service Account

If you want to use the CLI script:

### Where to put service account JSON:

**Option A:** `functions/creds/service-account.json` (recommended)
```bash
mkdir -p functions/creds
mv path/to/your-service-account.json functions/creds/service-account.json
```

**Option B:** `creds/service-account.json` (root level)
```bash
mkdir -p creds
mv path/to/your-service-account.json creds/service-account.json
```

### Then run:
```bash
cd functions
npm run migrate:users
```

---

## 🌐 Option 3: Using Environment Variable

Set the environment variable to point to your service account:

### Windows (PowerShell):
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
cd functions
npm run migrate:users
```

### Windows (CMD):
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json
cd functions
npm run migrate:users
```

### Git Bash / Linux / Mac:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
cd functions
npm run migrate:users
```

---

## 🎯 For Production Migration

### Using gcloud CLI (No service account needed!)

If you have gcloud installed and are logged in:

```bash
# Login to gcloud
gcloud auth application-default login

# Run migration
cd functions
npm run migrate:users
```

---

## 🔍 Troubleshooting

### Error: "Unable to detect a Project Id"

**Solution:** Use the API endpoint instead (Option 1) - it's easier!

OR set the project explicitly:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
export GCLOUD_PROJECT="journalxp-4ea0f"
cd functions
npm run migrate:users
```

### Error: "Port 5002 not open"

Your emulator isn't running. Start it:
```bash
npm run emulators
```

### Error: "403 Unauthorized"

Change the migration key in the URL:
```bash
curl -X POST "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/user-fields?key=YOUR_KEY"
```

---

## 📋 Summary

**Easiest:** Use the API endpoint (Option 1)
- ✅ No credentials needed
- ✅ Works with emulator
- ✅ Quick and simple

**For Production:** Get service account from Firebase Console
1. Go to [Project Settings → Service Accounts](https://console.firebase.google.com/project/journalxp-4ea0f/settings/serviceaccounts/adminsdk)
2. Click "Generate New Private Key"
3. Save as `functions/creds/service-account.json`
4. Run `npm run migrate:users`

---

## ✨ My Recommendation

**For local testing:** Use Option 1 (API endpoint)

**For production:** Use Option 2 (CLI script) after downloading service account from Firebase Console

The API endpoint is the easiest because your emulator is already running and authenticated!
