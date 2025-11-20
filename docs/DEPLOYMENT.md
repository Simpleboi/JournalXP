# JournalXP Deployment Guide

## Quick Start

### Full Deployment (Frontend + Functions)

```bash
npm run deploy
```

### Deploy Frontend Only

```bash
npm run deploy:hosting
```

### Deploy Functions Only

```bash
npm run deploy:functions
```

## Development

### Start Firebase Emulators

```bash
npm run emulators          # Functions only
npm run emulators:all      # All emulators
```

### Start Frontend Dev Server

```bash
npm run dev:front
```

**Important**: Make sure emulators are running before starting the frontend!

## Deployment Scripts

### Option 1: NPM Scripts (Recommended for Windows)

```bash
npm run deploy              # Build & deploy everything
npm run deploy:hosting      # Frontend only
npm run deploy:functions    # Functions only
```

## Build Commands

### Build Everything

```bash
npm run build
```

### Build Frontend Only

```bash
npm run build:front
```

### Build Functions Only

```bash
cd functions && npm run build
```

## Environment Configuration

### Development APIs

This url points to the functions url that runs on emulators.

- API URL: `http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api`
- Configured in: `frontend/.env` (VITE_API_DEV)

### Production

- API URL: `https://journalxp-4ea0f.web.app/api`
- Configured in: `frontend/.env` (VITE_API_PROD)
- Uses Firebase Hosting rewrites to route `/api/**` to Cloud Functions

## Deployment Checklist

Before deploying to production:

- [ ] Test locally with emulators
- [ ] Run `npm run build` to check for build errors
- [ ] Verify environment variables in `frontend/.env`
- [ ] Check Firebase project ID in `firebase.json`
- [ ] Ensure you're logged into Firebase CLI (`firebase login`)
- [ ] Review changes with `git status` and commit if needed

## Live URLs

- **Production**: https://journalxp-4ea0f.web.app
- **Emulator UI**: http://127.0.0.1:4000
- **Functions Emulator**: http://127.0.0.1:5002

## Additional Commands

### View Deployment Status

```bash
firebase hosting:channel:list
```

### View Logs

```bash
firebase functions:log
```
