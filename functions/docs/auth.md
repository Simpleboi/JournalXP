# Firebase Auth

When you call one of the Firebase Auth SDK methods, like:

```ts
import { createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
const { user } = await createUserWithEmailAndPassword(auth, email, password);
```

Firebase create a new user record in its Authentication service, then gives you a UserCredential object.

This is what the promise resolves to:

```bash
{
  user: {...},         // FirebaseUser object
  providerId: "password",
  operationType: "signIn"
}
```

These are some of the properties from the user object sent back from firebase:

| Property            | definition                                                       |
| ------------------- | ---------------------------------------------------------------- |
| **uid**             | Unique identifier for the user (e.g. "v1Ae4FvF9wTZ8DZuEoGdE...") |
| **email**           | User’s email address (if email/password or Google sign-in)       |
| **emailVerified**   | Boolean — true if the email has been verified                    |
| **displayName**     | Full name if using Google/OAuth; otherwise null                  |
| **photoURL**        | Profile photo URL (for OAuth providers)                          |
| **phoneNumber**     | User’s phone number (if using phone auth)                        |
| **isAnonymous**     | true if it’s an anonymous sign-in                                |
| **providerData**    | Array of linked auth providers (Google, GitHub, etc.)            |
| **metadata**        | Object with creation & last sign-in timestamps                   |
| **accessToken**     | JWT you can send to backend for verification                     |
| **stsTokenManager** | Object managing the user’s ID token and refresh token            |
| **getIdToken()**    | Async method to get a fresh ID token                             |

An example of this is as follows:

```json
{
  "uid": "v1Ae4FvF9wTZ8DZuEoGdE",
  "email": "nate@example.com",
  "displayName": null,
  "emailVerified": false,
  "photoURL": null,
  "isAnonymous": false,
  "providerData": [
    {
      "providerId": "password",
      "uid": "nate@example.com",
      "displayName": null,
      "email": "nate@example.com",
      "phoneNumber": null,
      "photoURL": null
    }
  ],
  "metadata": {
    "createdAt": "1730481200000",
    "lastLoginAt": "1730481200000"
  }
}
```

You don’t send the full user object (that’s insecure).
You send the ID token, which is a short-lived JWT proving their identity.

```ts
const token = await user.getIdToken();

await fetch("/api/session/init", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
});
```

Our backend will verify this token using firebase Admin SDK

```ts
const decoded = await admin.auth().verifyIdToken(token);
console.log(decoded.uid, decoded.email);
```

This gives you a trusted version of the user's identity.
