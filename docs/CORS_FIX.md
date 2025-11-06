# CORS Error Fix

## Problem
You're getting a CORS error because:
1. Frontend is calling the **production** API from localhost
2. Production API doesn't have the new authentication code deployed yet
3. The new code requires `Access-Control-Allow-Credentials: true` for cookie support

## Solution: Use Local Emulator for Development

### Step 1: Ensure Functions are Built
```bash
cd functions
npm run build
```

### Step 2: Start Firebase Emulators
In a **separate terminal**, run:
```bash
firebase emulators:start --only functions
```

You should see:
```
✔  functions: Loaded functions definitions from source
✔  functions[us-central1-api]: http function initialized
```

### Step 3: Verify Frontend Configuration
The frontend has been updated to automatically use:
- **Development**: `http://127.0.0.1:5001/journalxp-4ea0f/us-central1/api`
- **Production**: `https://api-qqraybadna-uc.a.run.app`

### Step 4: Restart Frontend Dev Server
```bash
# Stop current dev server (Ctrl+C)
# Then restart
npm run dev:front
```

### Step 5: Test
1. Open http://localhost:5173
2. Sign in with your credentials
3. Check the browser console - you should see:
   ```
   🔐 authFetch: POST http://127.0.0.1:5001/journalxp-4ea0f/us-central1/api/session/init
   ✅ Session initialized
   ```

## Alternative: Deploy to Production

If you want to use the production API:

```bash
cd functions
npm run build
npm run deploy
```

Wait for deployment to complete (2-5 minutes), then test again.

## Verification Checklist

- [ ] Functions emulator is running (check terminal for "functions initialized")
- [ ] Frontend dev server is running
- [ ] Browser console shows requests going to `127.0.0.1:5001` (not the production URL)
- [ ] No CORS errors in console
- [ ] Session initialization succeeds

## Troubleshooting

### "Connection refused" or "Failed to fetch"
- Make sure emulator is running: `firebase emulators:start --only functions`
- Check emulator port matches your `.env` file

### Still getting production URL in requests
- Clear browser cache
- Restart Vite dev server
- Check `console.log` in authFetch.ts shows correct URL

### Emulator not starting
- Check that port 5001 is not in use
- Try: `firebase emulators:start --only functions --project=journalxp-4ea0f`

## Current Setup

Your `.env` file has:
```env
VITE_API_DEV=http://127.0.0.1:5001/journalxp-4ea0f/us-central1/api
VITE_API_PROD=https://api-qqraybadna-uc.a.run.app
```

The `authFetch.ts` now automatically selects the correct URL based on `import.meta.env.MODE`.

## Next Steps

Once everything works locally:
1. Test sign-in/sign-out flow
2. Verify user documents are created in Firestore
3. Check session cookies in DevTools
4. Deploy to production when ready
