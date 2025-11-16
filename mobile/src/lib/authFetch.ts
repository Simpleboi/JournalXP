/**
 * Mobile-specific authenticated fetch wrapper for React Native/Expo
 *
 * This provides the same interface as the web version but uses
 * React Native's fetch and Firebase React Native SDK
 */

// TODO: Import Firebase Auth when installed
// import { getAuth } from 'firebase/auth';

/**
 * API base URL configuration
 */
const getApiBaseUrl = () => {
  // For development, you can use ngrok or your local IP
  // For production, use the deployed Cloud Functions URL
  if (__DEV__) {
    // Development: Use emulator or ngrok
    // return 'http://10.0.2.2:5001/journalxp-4ea0f/us-central1/api'; // Android emulator
    // return 'http://localhost:5001/journalxp-4ea0f/us-central1/api'; // iOS simulator
    return 'https://api-qqraybadna-uc.a.run.app'; // Production (for now)
  }
  // Production
  return 'https://api-qqraybadna-uc.a.run.app';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Authenticated fetch wrapper for mobile
 *
 * This function automatically:
 * 1. Gets a fresh Firebase ID token from the current user
 * 2. Adds the token to the Authorization header
 * 3. Handles errors with structured error messages
 *
 * @param path - API endpoint path (e.g., "/journals")
 * @param init - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws Error with structured error message on failure
 */
export async function authFetch(path: string, init?: RequestInit): Promise<any> {
  try {
    // TODO: Get fresh ID token from Firebase Auth
    // const auth = getAuth();
    // const token = await auth.currentUser?.getIdToken(true);

    // For now, we'll throw an error if auth is not set up
    const token = null; // Replace with actual token once Firebase is configured

    // Construct full URL
    const url = path.startsWith('http')
      ? path
      : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

    console.log(`🔐 authFetch: ${init?.method || 'GET'} ${url}`);

    // Make authenticated request
    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
        // Add Authorization header if token is available
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // Handle non-OK responses
    if (!res.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        // If JSON parsing fails, use status text
        errorData = { error: res.statusText };
      }

      // Create structured error message
      const errorMessage = errorData.error || `Request failed: ${res.status}`;
      const errorDetails = errorData.details || '';
      const errorCode = errorData.code || 'UNKNOWN_ERROR';

      const error = new Error(
        errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage
      );
      (error as any).code = errorCode;
      (error as any).status = res.status;

      throw error;
    }

    // Parse and return JSON response
    // Handle 204 No Content responses (no body to parse)
    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return null;
    }

    return res.json();
  } catch (error: any) {
    console.error('authFetch error:', error);
    throw error;
  }
}

/**
 * Unauthenticated fetch wrapper (no token required)
 *
 * Use this for public endpoints that don't require authentication
 *
 * @param path - API endpoint path
 * @param init - Fetch options
 * @returns Parsed JSON response
 */
export async function publicFetch(path: string, init?: RequestInit): Promise<any> {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  console.log(`🌐 publicFetch: ${init?.method || 'GET'} ${url}`);

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = { error: res.statusText };
    }

    const errorMessage = errorData.error || `Request failed: ${res.status}`;
    throw new Error(errorMessage);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null;
  }

  return res.json();
}
