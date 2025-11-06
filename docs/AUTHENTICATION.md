# JournalXP Authentication & Session Management

## Overview

JournalXP implements a secure, production-ready authentication system using Firebase Authentication with server-side verification. This document explains the complete authentication flow, security considerations, and how to use the authentication system.

## Architecture

### Two-Tier Authentication

1. **Client-Side (Firebase Web SDK)**
   - User signs in via Firebase Authentication
   - Firebase manages the authentication state
   - ID tokens are generated for each authenticated request

2. **Server-Side (Firebase Admin SDK)**
   - Verifies ID tokens sent by the client
   - Creates/updates user documents in Firestore
   - Optionally creates session cookies for persistent auth
   - Never trusts client-side data without verification

### Authentication Methods

The system supports two authentication methods:

#### 1. Bearer Token Authentication (Default)
- Client sends Firebase ID token in `Authorization: Bearer <token>` header
- Server verifies token with `admin.auth().verifyIdToken()`
- Token is short-lived (1 hour) and auto-refreshed by Firebase SDK
- Best for: API calls, mobile apps, SPAs

#### 2. Session Cookie Authentication (Optional)
- Server creates HTTP-only session cookie after initial token verification
- Cookie is valid for 14 days
- Server verifies cookie with `admin.auth().verifySessionCookie()`
- Best for: Web apps requiring persistent sessions

## Token Flow

### Initial Sign-In Flow

```
┌─────────┐                 ┌──────────┐                 ┌─────────┐
│ Client  │                 │  Cloud   │                 │Firebase │
│ Browser │                 │Functions │                 │ Admin   │
└────┬────┘                 └────┬─────┘                 └────┬────┘
     │                           │                            │
     │  1. Sign in with         │                            │
     │     Firebase Auth SDK    │                            │
     │─────────────────────────>│                            │
     │                           │                            │
     │  2. Get ID token          │                            │
     │<─────────────────────────│                            │
     │                           │                            │
     │  3. POST /session/init    │                            │
     │     Authorization:        │                            │
     │     Bearer <idToken>      │                            │
     │──────────────────────────>│                            │
     │                           │                            │
     │                           │  4. Verify ID token        │
     │                           │───────────────────────────>│
     │                           │                            │
     │                           │  5. Token valid + claims   │
     │                           │<───────────────────────────│
     │                           │                            │
     │                           │  6. Create/update user doc │
     │                           │     in Firestore           │
     │                           │                            │
     │                           │  7. Create session cookie  │
     │                           │     (optional)             │
     │                           │                            │
     │  8. Set-Cookie: __session │                            │
     │     + user data           │                            │
     │<──────────────────────────│                            │
     │                           │                            │
```

### Authenticated Request Flow

```
┌─────────┐                 ┌──────────┐                 ┌─────────┐
│ Client  │                 │  Cloud   │                 │Firebase │
│ Browser │                 │Functions │                 │ Admin   │
└────┬────┘                 └────┬─────┘                 └────┬────┘
     │                           │                            │
     │  GET /auth/me             │                            │
     │  Cookie: __session=...    │                            │
     │  (or Bearer token)        │                            │
     │──────────────────────────>│                            │
     │                           │                            │
     │                           │  Verify cookie/token       │
     │                           │───────────────────────────>│
     │                           │                            │
     │                           │  Claims + uid              │
     │                           │<───────────────────────────│
     │                           │                            │
     │                           │  Fetch user from Firestore │
     │                           │                            │
     │  User data                │                            │
     │<──────────────────────────│                            │
     │                           │                            │
```

## API Endpoints

### Session Management

#### POST /api/session/init
Initialize or refresh a user session.

**Request:**
```typescript
POST /api/session/init
Authorization: Bearer <idToken>
Content-Type: application/json

{
  "createCookie": true  // Optional, default: false
}
```

**Response:**
```typescript
{
  "user": {
    "username": "johndoe",
    "level": 5,
    "xp": 1250,
    "totalXP": 5000,
    "xpNeededToNextLevel": 500,
    "streak": 7,
    "rank": "Gold I",
    "profilePicture": "https://...",
    "journalStats": { ... },
    "taskStats": { ... }
  },
  "sessionCookie": true,  // Cookie was created
  "expiresAt": "2025-01-19T12:00:00Z",  // Cookie expiration
  "message": "Session initialized"
}
```

**What it does:**
1. Verifies the Firebase ID token
2. Creates a new user document if this is the first sign-in
3. Updates `lastLogin` timestamp for existing users
4. Optionally creates a session cookie for persistent auth
5. Returns the full user profile

#### POST /api/session/logout
Logout the current user and clear session.

**Request:**
```typescript
POST /api/session/logout
Content-Type: application/json

{
  "revokeTokens": false  // Optional, default: false
}
```

**Response:**
```typescript
{
  "success": true,
  "message": "Logged out successfully"
}
```

**What it does:**
1. Clears the `__session` cookie
2. Optionally revokes all refresh tokens (signs out from all devices)

#### POST /api/session/refresh
Refresh the current session without re-initialization.

**Request:**
```typescript
POST /api/session/refresh
Authorization: Bearer <idToken>
// or
Cookie: __session=...
```

**Response:**
```typescript
{
  "user": { ... },
  "message": "Session refreshed"
}
```

**What it does:**
1. Updates the `lastLogin` timestamp
2. Returns fresh user data

### Authentication

#### GET /api/auth/me
Get the current authenticated user's data.

**Request:**
```typescript
GET /api/auth/me
Authorization: Bearer <idToken>
// or
Cookie: __session=...
```

**Response:**
```typescript
{
  "user": { ... },
  "authenticated": true,
  "sessionType": "token" | "cookie"
}
```

**What it does:**
1. Verifies authentication (token or cookie)
2. Fetches and returns current user data from Firestore
3. Useful for restoring user state after page reload

#### GET /api/auth/status
Quick authentication status check (no database query).

**Request:**
```typescript
GET /api/auth/status
Authorization: Bearer <idToken>
// or
Cookie: __session=...
```

**Response:**
```typescript
{
  "authenticated": true,
  "uid": "abc123...",
  "email": "user@example.com",
  "sessionType": "token" | "cookie"
}
```

**What it does:**
1. Verifies authentication only (no Firestore query)
2. Returns basic auth info
3. Fast and lightweight

## Frontend Integration

### Basic Setup

```typescript
import { initSession, logoutSession, getCurrentUser } from "@/lib/initSession";
import { authFetch } from "@/lib/authFetch";

// Initialize session after Firebase Auth sign-in
const user = await initSession(true); // true = create session cookie

// Make authenticated API calls
const data = await authFetch("/api/some-endpoint");

// Logout
await logoutSession(false); // false = don't revoke tokens
```

### React Integration Example

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initSession, logoutSession, getCurrentUser } from "@/lib/initSession";
import type { UserClient } from "@shared/types/user";

interface AuthContextType {
  user: User | null;
  userData: UserClient | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Initialize session and get user data
          const backendUser = await initSession(true);
          setUserData(backendUser);
          console.log("✅ Session initialized:", backendUser);
        } catch (err) {
          console.error("⚠️ Failed to init session:", err);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Clear backend session
      await logoutSession(false);

      // Sign out from Firebase
      await signOut(auth);

      setUserData(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const refreshUserData = async () => {
    try {
      const freshData = await getCurrentUser();
      setUserData(freshData);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, logout, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

### Protected Routes

```typescript
// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/Spinner";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## Security Considerations

### Transport Security

#### HTTPS Only (Production)
- All cookies have `secure: true` in production
- Cookies only sent over HTTPS connections
- Protects against man-in-the-middle attacks

#### HTTP-Only Cookies
- Session cookies are HTTP-only
- Not accessible via JavaScript (`document.cookie`)
- Protects against XSS attacks

#### SameSite Protection
- Cookies use `SameSite: lax`
- Protects against CSRF attacks
- Cookies not sent with cross-site requests (except navigation)

### Token Security

#### Short-Lived Tokens
- Firebase ID tokens expire after 1 hour
- Client SDK automatically refreshes tokens
- Reduces impact of token theft

#### Token Revocation
- Tokens can be revoked via `admin.auth().revokeRefreshTokens(uid)`
- Useful for sign-out from all devices
- `checkRevoked: true` in verify calls ensures revoked tokens are rejected

#### Token Verification
- All tokens verified server-side with `verifyIdToken()` or `verifySessionCookie()`
- Client-side auth state never trusted
- Claims extracted from verified tokens only

### CORS Configuration

```typescript
// Current configuration
app.use(cors({
  origin: true,  // Development: allow all origins
  credentials: true,  // Enable cookies
}));

// Production recommendation
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true,
}));
```

### Cookie Configuration

```typescript
const SESSION_COOKIE_OPTIONS = {
  maxAge: 14 * 24 * 60 * 60 * 1000,  // 14 days
  httpOnly: true,  // Not accessible via JavaScript
  secure: process.env.NODE_ENV === "production",  // HTTPS only
  sameSite: "lax",  // CSRF protection
  path: "/",  // Available on all paths
};
```

## Error Handling

### Structured Error Responses

All API errors follow this format:

```typescript
{
  "error": "Error message",
  "details": "Detailed error description",
  "code": "ERROR_CODE"
}
```

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `NO_AUTH` | No authentication provided | 401 |
| `TOKEN_EXPIRED` | ID token expired | 401 |
| `TOKEN_REVOKED` | Token was revoked | 401 |
| `INVALID_TOKEN` | Malformed token | 401 |
| `SESSION_EXPIRED` | Session cookie expired | 401 |
| `SESSION_REVOKED` | Session was revoked | 401 |
| `USER_NOT_FOUND` | User document doesn't exist | 404 |
| `AUTH_FAILED` | Generic auth failure | 401 |
| `SESSION_INIT_FAILED` | Session init error | 500 |
| `LOGOUT_FAILED` | Logout error | 500 |

### Frontend Error Handling

```typescript
try {
  const user = await initSession();
} catch (error: any) {
  if (error.code === "TOKEN_EXPIRED") {
    // Prompt user to sign in again
    showLoginPrompt();
  } else if (error.code === "USER_NOT_FOUND") {
    // Create user document
    await createUserProfile();
  } else {
    // Generic error handling
    showError(error.message);
  }
}
```

## Testing

### Local Development

1. **Start Firebase Emulators:**
   ```bash
   firebase emulators:start --only hosting,functions
   ```

2. **Configure Frontend:**
   ```env
   # frontend/.env
   VITE_API_URL=http://localhost:5000
   ```

3. **Test Authentication:**
   ```typescript
   // Sign in with Firebase Auth
   import { signInWithEmailAndPassword } from "firebase/auth";
   import { auth } from "@/lib/firebase";

   const userCredential = await signInWithEmailAndPassword(
     auth,
     "test@example.com",
     "password"
   );

   // Initialize session
   const user = await initSession(true);
   console.log("User:", user);

   // Test authenticated endpoint
   const me = await authFetch("/auth/me");
   console.log("Me:", me);

   // Logout
   await logoutSession();
   ```

### Curl Examples

```bash
# Get ID token from Firebase (you'll need to do this via Firebase SDK)
ID_TOKEN="your-firebase-id-token"

# Initialize session (create cookie)
curl -v -X POST http://localhost:5000/api/session/init \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"createCookie": true}' \
  -c cookies.txt

# Use session cookie for subsequent requests
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:5000/api/session/logout \
  -b cookies.txt
```

## Best Practices

### 1. Always Use HTTPS in Production
- Never send tokens over HTTP
- Configure `secure: true` for cookies
- Use Firebase Hosting (automatic HTTPS)

### 2. Implement Proper Error Handling
- Don't expose sensitive error details to clients
- Log errors server-side for debugging
- Return user-friendly error messages

### 3. Use Session Cookies for Web Apps
- Better UX (persistent sessions)
- Reduces token refresh calls
- Still secure with HTTP-only + SameSite

### 4. Refresh User Data Appropriately
- Use `/auth/me` to restore state after page reload
- Use `/session/refresh` to extend session lifetime
- Don't call `/session/init` on every request

### 5. Implement Logout Properly
- Clear both Firebase and backend sessions
- Use token revocation for sensitive apps
- Handle logout failures gracefully

### 6. Validate Input
- Never trust client data
- Validate all inputs server-side
- Sanitize data before storing

### 7. Monitor Authentication
- Log failed auth attempts
- Track token expiration rates
- Alert on unusual patterns

## Troubleshooting

### "No authentication token or session cookie provided"
- Check that `credentials: "include"` is set in fetch calls
- Verify Authorization header is being sent
- Check CORS configuration allows credentials

### "Token expired"
- Normal for tokens > 1 hour old
- Firebase SDK should auto-refresh
- Call `getIdToken(true)` to force refresh

### "Session cookie expired"
- Session cookies expire after 14 days
- User needs to sign in again
- Consider auto-refresh before expiration

### "CORS errors"
- Check `origin` in CORS config
- Verify `credentials: true` is set
- Ensure request includes origin header

### "User not found"
- Call `/session/init` first to create user doc
- Check Firestore rules allow user creation
- Verify Firebase project ID is correct

## Migration Guide

### From Client-Only Auth to Server-Side Auth

1. **Add initSession call after sign-in:**
   ```typescript
   // Before
   await signInWithEmailAndPassword(auth, email, password);

   // After
   await signInWithEmailAndPassword(auth, email, password);
   await initSession(true); // Add this
   ```

2. **Update API calls to use authFetch:**
   ```typescript
   // Before
   const res = await fetch("/api/endpoint", {
     headers: { Authorization: `Bearer ${token}` }
   });

   // After
   import { authFetch } from "@/lib/authFetch";
   const data = await authFetch("/endpoint");
   ```

3. **Add logout call:**
   ```typescript
   // Before
   await signOut(auth);

   // After
   await logoutSession();
   await signOut(auth);
   ```

## Summary

JournalXP's authentication system provides:

✅ **Server-side verification** - Never trust client auth state
✅ **Dual authentication** - Bearer tokens + session cookies
✅ **Secure by default** - HTTP-only, SameSite, HTTPS
✅ **Production-ready** - Error handling, logging, monitoring
✅ **Developer-friendly** - Clear APIs, TypeScript types, docs

For questions or issues, consult the source code in:
- `functions/src/middleware/requireAuth.ts` - Auth middleware
- `functions/src/routes/session.ts` - Session endpoints
- `functions/src/routes/auth.ts` - Auth endpoints
- `frontend/src/lib/authFetch.ts` - Client fetch wrapper
- `frontend/src/lib/initSession.ts` - Session management
