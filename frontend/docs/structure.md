## Documentation Structure

This document outlines the structure of the frontend application.

## Authentication flow (frontend)

The following diagram and notes describe the expected authentication/session flow for the frontend and backend (Cloud Functions). Use this as the canonical reference when implementing or debugging the login/session behavior.

```mermaid
flowchart TD
	A[User opens app] --> B[Client checks Firebase auth state]
	B -->|not signed in| C[Show login/signup UI]
	B -->|signed in| D[Obtain fresh ID token via getIdToken(true)]
	C --> E[User signs in/up with Firebase Auth (client SDK)]
	E --> D
	D --> F[POST /api/session/init with Authorization: Bearer <ID_TOKEN> and credentials: 'include']
	F --> G[Functions: verify ID token with admin.auth().verifyIdToken]
	G --> H{Token valid?}
	H -->|no| I[Return 401/4xx JSON { error: '...' }]
	H -->|yes| J[Create/Update Firestore user doc (server-side) + serverTimestamp()]
	J --> K[Create session cookie via admin.auth().createSessionCookie(token, {expiresIn})]
	K --> L[Set httpOnly, secure cookie `__session` (credentials: 'include')]
	L --> M[Client now sends cookie with subsequent requests -> server trusts session cookie]
	M --> N[Protected APIs accept either session cookie or Authorization header]
```

Key points / contract

- Client responsibilities:

  - Use Firebase client SDK to sign in or create accounts.
  - After sign-in, call getIdToken(true) to force-refresh ID token when establishing a session.
  - POST the token to `POST /api/session/init` with header `Authorization: Bearer <ID_TOKEN>` and fetch option `credentials: 'include'` so the server can set an httpOnly cookie.
  - On error, read JSON response shape `{ error: string, details?: string }` and display an appropriate message to the user.

- Server (Cloud Functions) responsibilities:

  - Verify incoming ID tokens via `admin.auth().verifyIdToken(idToken)` or accept an existing session via `admin.auth().verifySessionCookie(cookie, true)`.
  - Create or update the Firestore user document server-side. Use `FieldValue.serverTimestamp()` for createdAt/updatedAt and sanitize Timestamps to ISO strings when returning to client.
  - Mint a session cookie using `admin.auth().createSessionCookie(idToken, {expiresIn})` and set it on the response as an httpOnly cookie named `__session` (secure=true in prod, sameSite appropriate for your setup).
  - Return JSON errors `{ error: '...' }` for client consumption. Keep error messages informative but avoid leaking sensitive internal traces in production.

- Cookie / security notes:

  - The `__session` cookie should be httpOnly and secure in production (set Secure and SameSite as required by your frontend hosting).
  - For local development with the emulator, you may omit secure flag but ensure you only do that in dev.
  - Protected endpoints should accept either the session cookie or `Authorization: Bearer <ID_TOKEN>` for flexibility (e.g., API clients).

- Typical error modes and debugging tips:
  - ECONNREFUSED from the Vite proxy: means the dev target (emulator or backend) is not running. Verify `VITE_API_URL` and emulators are started.
  - 401 from `verifyIdToken`: token expired or invalid — call `getIdToken(true)` and retry.
  - 500 on session init: check server logs (emulator or Cloud Run) and ensure Admin SDK credentials are configured (ADC or service-account JSON).

Quick checklist for local dev

1. Start Firebase emulators (hosting + functions) or ensure backend is reachable.
2. Set `VITE_API_URL=http://localhost:5000` (hosting emulator) or appropriate URL in `.env`.
3. Run frontend dev server with `npm run dev:front`.
4. Sign in in the UI and check network tab for `POST /api/session/init` and that the response sets `Set-Cookie: __session=...` and returns JSON `{ success: true }` (or no error).

If you'd like, I can also add a small sequence diagram PNG or an ASCII fallback for environments that don't render Mermaid on your docs viewer.

# File Structure

/
├── public/
├── src/
│ ├── assets/
│ │ └── images/
│ ├── auth/ # 🔐 Login, Signup, Auth logic
│ ├── components/ # 🧩 Reusable UI (buttons, modals, etc.)
│ ├── context/ # 🌍 Global state/context providers
│ ├── data/ # 🧠 Static JSON or local mock data
│ ├── features/ # 🌟 Feature-based folders (scales beautifully)
│ │ ├── journal/ # Pages + logic for journaling
│ │ ├── mood/ # Mood tracker
│ │ ├── prompts/ # Prompts + quote logic
│ │ ├── dashboard/ # Main user dashboard
│ │ ├── profile/ # Profile page + components
│ │ ├── achievements/# Badges, progress bars, XP
│ ├── hooks/ # 🪝 Custom hooks (useAuth, useJournal, etc.)
│ ├── lib/ # 🧰 Firebase, utility functions, API handlers
│ ├── models/ # 📦 Firestore types or class-based models
│ ├── pages/ # 📄 Top-level routes if not using React Router v6
│ ├── routes/ # 🧭 React Router configs
│ ├── services/ # 🔌 External APIs / Firestore / auth utils
│ ├── styles/ # 🎨 Global styles, Tailwind extensions
│ ├── tempobook/ # 📘 Special module (could be merged under /features if it's app-specific)
│ ├── types/ # 🔡 Global TypeScript types
│ ├── docs/ # 📚 Internal markdown or feature docs
│ ├── App.tsx
│ ├── main.tsx
│ ├── index.css
│ ├── vite-env.d.ts
├── .env
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.js
├── readme.md
├── tempo.config.json
