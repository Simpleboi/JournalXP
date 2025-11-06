# Authentication Quick Start Guide

## 5-Minute Setup

Get JournalXP authentication working in 5 minutes.

## Prerequisites

- Node.js 22+
- Firebase project configured
- JournalXP codebase cloned

## Step 1: Install Dependencies (if needed)

```bash
# Backend (Cloud Functions)
cd functions
npm install

# Frontend
cd frontend
npm install
```

## Step 2: Start Development Environment

```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start --only hosting,functions

# Terminal 2: Start Frontend Dev Server
npm run dev:front
```

## Step 3: Configure Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Step 4: Test Authentication Flow

### Sign In

```typescript
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initSession } from "@/lib/initSession";

// 1. Sign in with Firebase
const credential = await signInWithEmailAndPassword(
  auth,
  "test@example.com",
  "password123"
);

// 2. Initialize backend session (creates user doc + session cookie)
const user = await initSession(true);

console.log("Logged in:", user);
// Output: { username: "...", level: 1, xp: 0, ... }
```

### Make Authenticated Requests

```typescript
import { authFetch } from "@/lib/authFetch";

// Get current user
const { user } = await authFetch("/auth/me");

// Any protected endpoint
const data = await authFetch("/api/your-endpoint");
```

### Logout

```typescript
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logoutSession } from "@/lib/initSession";

// 1. Clear backend session
await logoutSession();

// 2. Sign out from Firebase
await signOut(auth);
```

## Step 5: Protect Your Routes

### Backend (Cloud Functions)

```typescript
import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";

const router = Router();

// Protected endpoint
router.get("/protected", requireAuth, async (req, res) => {
  const { uid } = (req as AuthenticatedRequest).user!;

  res.json({
    message: "You are authenticated!",
    uid
  });
});

export default router;
```

### Frontend (React)

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

// Usage in App.tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Common Patterns

### React Context Integration

```typescript
// contexts/AuthContext.tsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initSession } from "@/lib/initSession";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const data = await initSession(true);
        setUserData(data);
      } else {
        setUserData(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Error Handling

```typescript
try {
  const user = await initSession();
} catch (error: any) {
  switch (error.code) {
    case "TOKEN_EXPIRED":
      // Redirect to login
      window.location.href = "/login";
      break;

    case "USER_NOT_FOUND":
      // Shouldn't happen, but handle gracefully
      console.error("User document not found");
      break;

    default:
      // Generic error
      alert(`Error: ${error.message}`);
  }
}
```

## Testing Checklist

✅ Sign in creates user document in Firestore
✅ Session cookie is set (check DevTools → Application → Cookies → __session)
✅ `/api/auth/me` returns user data
✅ Protected routes require authentication
✅ Logout clears cookie
✅ Re-authentication works after logout

## Debugging Tips

### Check Cookie is Set

1. Open DevTools (F12)
2. Application → Cookies → http://localhost:5000
3. Look for `__session` cookie

### Check Token

```typescript
import { getAuth } from "firebase/auth";

const token = await getAuth().currentUser?.getIdToken();
console.log("ID Token:", token);
```

### Check Backend Logs

```bash
# In emulator output
[functions] → Auth: Bearer token
[functions] ✅ Created new user document for uid: abc123
```

### Test Endpoints with curl

```bash
# Get your ID token (from browser console)
TOKEN="your-firebase-id-token"

# Initialize session
curl -v -X POST http://localhost:5000/api/session/init \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"createCookie": true}' \
  -c cookies.txt

# Use session cookie
curl http://localhost:5000/api/auth/me -b cookies.txt
```

## Next Steps

1. **Read Full Docs** - See `docs/AUTHENTICATION.md` for complete documentation
2. **Customize User Schema** - Add custom fields to user document
3. **Add Protected Routes** - Secure your API endpoints
4. **Deploy** - Deploy to Firebase Hosting + Functions

## Quick Reference

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/session/init` | POST | Initialize session |
| `/api/session/logout` | POST | Logout |
| `/api/auth/me` | GET | Get current user |

### Frontend Functions

| Function | Purpose |
|----------|---------|
| `initSession(createCookie?)` | Initialize backend session |
| `logoutSession(revokeTokens?)` | Logout from backend |
| `getCurrentUser()` | Get current user data |
| `authFetch(path, options?)` | Make authenticated request |

### Error Codes

| Code | Meaning |
|------|---------|
| `TOKEN_EXPIRED` | ID token expired, need re-auth |
| `NO_AUTH` | No authentication provided |
| `USER_NOT_FOUND` | User document doesn't exist |

## Help

- **Full Documentation**: `docs/AUTHENTICATION.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **Source Code**: `functions/src/middleware/requireAuth.ts`
- **Frontend Code**: `frontend/src/lib/initSession.ts`

---

Happy coding! 🚀
