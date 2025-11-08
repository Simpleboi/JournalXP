# Quick Start: Fix `points` → `xp` Migration

Your frontend can't see `xp` because your Firestore documents still have the old `points` field. Here are 3 quick ways to fix it:

---

## ⚡ Option 1: API Endpoint (Easiest - No Setup!)

### Step 1: Make sure functions are running

Your emulator should be running. If not:
```bash
npm run emulators
```

### Step 2: Call the migration endpoint

**Using curl:**
```bash
curl -X POST "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/user-fields?key=migrate-123"
```

**Or using your browser console:**
```javascript
fetch('http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/user-fields?key=migrate-123', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

### Step 3: Check the results

```bash
# Check migration status
curl "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/status"
```

✅ **Done!** Refresh your frontend and you should see XP now.

---

## 🔧 Option 2: Migration Script (For Production)

### Step 1: Get service account credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/journalxp-4ea0f/settings/serviceaccounts/adminsdk)
2. Click **Generate New Private Key**
3. Save file as: `functions/creds/service-account.json`

### Step 2: Run migration

```bash
cd functions
npm run migrate:users
```

### Step 3: Verify

Check your Firebase Console → Firestore to see that users now have `xp` instead of `points`.

---

## 🎯 Option 3: Migrate on Login (Lazy Migration)

This migrates users automatically as they log in. No manual action needed!

Edit `functions/src/routes/session.ts` and add this after line 145:

```typescript
// After: const userData = freshSnapshot.data()!;

// Lazy migration: convert old field names on login
if (userData.points !== undefined && userData.xp === undefined) {
  console.log(`🔄 Migrating user ${uid}: points → xp`);
  await userRef.update({
    xp: userData.points,
    points: FieldValue.delete(),
  });

  // Refresh to get migrated data
  const migratedSnapshot = await userRef.get();
  Object.assign(userData, migratedSnapshot.data());
}
```

Then rebuild and restart emulator:
```bash
cd functions
npm run build
# Restart your emulator
```

Now users will be migrated automatically when they log in!

---

## Which Option Should I Use?

| Situation | Best Option |
|-----------|-------------|
| Testing locally with emulator | **Option 1** (API Endpoint) |
| Production with real users | **Option 2** (Migration Script) |
| Want automatic gradual migration | **Option 3** (On Login) |

---

## Testing the Migration

After running any option:

### 1. Check Firestore Console
1. Go to [Firebase Console](https://console.firebase.google.com/project/journalxp-4ea0f/firestore)
2. Open `users` collection
3. Open your user document
4. Verify `xp` field exists
5. Verify `points` field is gone

### 2. Test Frontend
1. Refresh your browser
2. You should see your XP displayed correctly
3. Check browser console - no more undefined errors

### 3. Call refreshUserData
```javascript
// In your React component
const { refreshUserData } = useUserData();
await refreshUserData();
```

---

## Troubleshooting

### "API returns 403 Unauthorized"
The default key is `migrate-123`. You can change it by setting `MIGRATION_KEY` environment variable.

### "Migration script can't find service account"
Make sure the file is at `functions/creds/service-account.json` and has proper permissions.

### "Frontend still shows undefined"
1. Clear browser cache
2. Call `refreshUserData()` in your app
3. Check that backend is actually running (emulator or deployed)

### "Changes not visible in emulator"
Emulator data is separate from production. Run migration against emulator if testing locally.

---

## For Production Deployment

After migrating locally and testing:

1. **Backup production data** (recommended)
2. **Deploy functions with migration route:**
   ```bash
   npm run deploy:functions
   ```

3. **Run migration on production:**
   ```bash
   # Option A: Via API
   curl -X POST "https://journalxp-4ea0f.web.app/api/migrate/user-fields?key=YOUR_KEY"

   # Option B: Via script (requires service account)
   cd functions
   npm run migrate:users
   ```

4. **Verify in Firebase Console**
5. **Test with real frontend**

---

## Security Note

For production, change the migration key:

```bash
# Set environment variable
firebase functions:config:set migration.key="your-secure-random-key-here"

# Deploy
firebase deploy --only functions
```

Then use your secure key in the API call:
```bash
curl -X POST "https://journalxp-4ea0f.web.app/api/migrate/user-fields?key=your-secure-random-key-here"
```

---

## Need More Details?

See `MIGRATION_GUIDE.md` for complete documentation including:
- Detailed migration strategies
- Error handling
- Adding more field migrations
- Rollback procedures
