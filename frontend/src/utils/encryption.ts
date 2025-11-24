/**
 * Encryption utility for secure vault entries
 * Uses Web Crypto API for client-side encryption
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

/**
 * Derives an encryption key from a password
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts text with a password
 */
export async function encrypt(text: string, password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Derive encryption key from password
    const key = await deriveKey(password, salt);

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(
      salt.length + iv.length + encryptedData.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

    // Convert to base64 for storage
    return arrayBufferToBase64(combined);
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypts text with a password
 */
export async function decrypt(encryptedText: string, password: string): Promise<string> {
  try {
    // Convert from base64
    const combined = base64ToArrayBuffer(encryptedText);

    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = combined.slice(SALT_LENGTH + IV_LENGTH);

    // Derive decryption key from password
    const key = await deriveKey(password, salt);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data. Invalid password or corrupted data.");
  }
}

/**
 * Validates if a password can decrypt the data
 */
export async function validatePassword(
  encryptedText: string,
  password: string
): Promise<boolean> {
  try {
    await decrypt(encryptedText, password);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a strong password hash for verification (not for encryption)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return arrayBufferToBase64(new Uint8Array(hashBuffer));
}

/**
 * Converts ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

/**
 * Converts Base64 string to Uint8Array
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}

/**
 * Checks if password meets security requirements
 */
export function isPasswordStrong(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates a random strong password
 */
export function generateStrongPassword(length: number = 16): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = lowercase + uppercase + numbers + special;

  let password = "";

  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
