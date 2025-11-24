import { useState, useCallback, useEffect } from "react";
import { encrypt, decrypt, hashPassword } from "@/utils/encryption";

interface PasswordProtectionOptions {
  storageKey?: string;
  sessionTimeout?: number; // minutes
}

interface UsePasswordProtectionReturn {
  isLocked: boolean;
  hasPassword: boolean;
  setPassword: (password: string) => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  removePassword: (password: string) => Promise<boolean>;
  encryptData: (data: string) => Promise<string>;
  decryptData: (encryptedData: string) => Promise<string | null>;
}

/**
 * Hook for password protection with session management
 */
export function usePasswordProtection(
  options: PasswordProtectionOptions = {}
): UsePasswordProtectionReturn {
  const {
    storageKey = "journalxp_vault_password",
    sessionTimeout = 30, // 30 minutes default
  } = options;

  const [isLocked, setIsLocked] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);

  // Check if password exists in localStorage
  useEffect(() => {
    const storedHash = localStorage.getItem(storageKey);
    setHasPassword(!!storedHash);
    setIsLocked(!!storedHash);
  }, [storageKey]);

  // Session timeout management
  useEffect(() => {
    if (!sessionExpiry || isLocked) return;

    const checkExpiry = setInterval(() => {
      if (Date.now() > sessionExpiry) {
        lock();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkExpiry);
  }, [sessionExpiry, isLocked]);

  // Activity monitoring to reset session timeout
  useEffect(() => {
    if (isLocked || !currentPassword) return;

    const resetTimeout = () => {
      setSessionExpiry(Date.now() + sessionTimeout * 60 * 1000);
    };

    // Reset on user activity
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);
    window.addEventListener("click", resetTimeout);

    return () => {
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("click", resetTimeout);
    };
  }, [isLocked, currentPassword, sessionTimeout]);

  /**
   * Set initial password for protection
   */
  const setPassword = useCallback(
    async (password: string): Promise<void> => {
      try {
        const hash = await hashPassword(password);
        localStorage.setItem(storageKey, hash);
        setHasPassword(true);
        setCurrentPassword(password);
        setIsLocked(false);
        setSessionExpiry(Date.now() + sessionTimeout * 60 * 1000);
      } catch (error) {
        console.error("Failed to set password:", error);
        throw new Error("Failed to set password");
      }
    },
    [storageKey, sessionTimeout]
  );

  /**
   * Unlock with password
   */
  const unlock = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        const storedHash = localStorage.getItem(storageKey);
        if (!storedHash) {
          return false;
        }

        const inputHash = await hashPassword(password);
        if (inputHash === storedHash) {
          setCurrentPassword(password);
          setIsLocked(false);
          setSessionExpiry(Date.now() + sessionTimeout * 60 * 1000);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Failed to unlock:", error);
        return false;
      }
    },
    [storageKey, sessionTimeout]
  );

  /**
   * Lock the vault
   */
  const lock = useCallback(() => {
    setCurrentPassword(null);
    setIsLocked(true);
    setSessionExpiry(null);
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<boolean> => {
      try {
        const storedHash = localStorage.getItem(storageKey);
        if (!storedHash) {
          return false;
        }

        const oldHash = await hashPassword(oldPassword);
        if (oldHash !== storedHash) {
          return false;
        }

        const newHash = await hashPassword(newPassword);
        localStorage.setItem(storageKey, newHash);
        setCurrentPassword(newPassword);
        return true;
      } catch (error) {
        console.error("Failed to change password:", error);
        return false;
      }
    },
    [storageKey]
  );

  /**
   * Remove password protection
   */
  const removePassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        const storedHash = localStorage.getItem(storageKey);
        if (!storedHash) {
          return false;
        }

        const inputHash = await hashPassword(password);
        if (inputHash === storedHash) {
          localStorage.removeItem(storageKey);
          setHasPassword(false);
          setCurrentPassword(null);
          setIsLocked(false);
          setSessionExpiry(null);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Failed to remove password:", error);
        return false;
      }
    },
    [storageKey]
  );

  /**
   * Encrypt data with current password
   */
  const encryptData = useCallback(
    async (data: string): Promise<string> => {
      if (!currentPassword) {
        throw new Error("No password set or vault is locked");
      }

      return encrypt(data, currentPassword);
    },
    [currentPassword]
  );

  /**
   * Decrypt data with current password
   */
  const decryptData = useCallback(
    async (encryptedData: string): Promise<string | null> => {
      if (!currentPassword) {
        return null;
      }

      try {
        return await decrypt(encryptedData, currentPassword);
      } catch (error) {
        console.error("Failed to decrypt data:", error);
        return null;
      }
    },
    [currentPassword]
  );

  return {
    isLocked,
    hasPassword,
    setPassword,
    unlock,
    lock,
    changePassword,
    removePassword,
    encryptData,
    decryptData,
  };
}
