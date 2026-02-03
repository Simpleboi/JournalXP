import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";
import { isPasswordStrong } from "@/utils/encryption";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Shield,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Key,
  AlertTriangle,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VaultEntry {
  id: string;
  title: string;
  content: string;
  encryptedContent: string;
  createdAt: string;
  updatedAt: string;
}

export function VaultSection() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const {
    isLocked,
    hasPassword,
    setPassword,
    unlock,
    lock,
    changePassword,
    removePassword,
    encryptData,
    decryptData,
  } = usePasswordProtection({ sessionTimeout: 30 });

  const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([]);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPasswordForChange, setNewPasswordForChange] = useState("");

  // Load vault entries from localStorage
  useEffect(() => {
    if (!isLocked) {
      loadVaultEntries();
    }
  }, [isLocked]);

  const loadVaultEntries = async () => {
    try {
      const stored = localStorage.getItem("journalxp_vault_entries");
      if (stored) {
        const encryptedEntries = JSON.parse(stored);
        const decryptedEntries = await Promise.all(
          encryptedEntries.map(async (entry: any) => {
            const decryptedContent = await decryptData(entry.encryptedContent);
            return {
              ...entry,
              content: decryptedContent || "[Unable to decrypt]",
            };
          })
        );
        setVaultEntries(decryptedEntries);
      }
    } catch (error) {
      console.error("Failed to load vault entries:", error);
      showToast({
        title: "Error",
        description: "Failed to load vault entries",
        variant: "destructive",
      });
    }
  };

  const handleSetPassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const validation = isPasswordStrong(newPassword);
    if (!validation.valid) {
      showToast({
        title: "Weak Password",
        description: validation.errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    try {
      await setPassword(newPassword);
      showToast({
        title: "Success",
        description: "Vault password set successfully",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to set password",
        variant: "destructive",
      });
    }
  };

  const handleUnlock = async () => {
    const success = await unlock(unlockPassword);
    if (success) {
      showToast({
        title: "Success",
        description: "Vault unlocked successfully",
      });
      setUnlockPassword("");
    } else {
      showToast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const handleLock = () => {
    lock();
    setVaultEntries([]);
    showToast({
      title: "Locked",
      description: "Vault has been locked",
    });
  };

  const handleSaveEntry = async () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim()) {
      showToast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const encryptedContent = await encryptData(newEntryContent);
      const newEntry: VaultEntry = {
        id: Date.now().toString(),
        title: newEntryTitle,
        content: newEntryContent,
        encryptedContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedEntries = [...vaultEntries, newEntry];
      setVaultEntries(updatedEntries);

      // Store only encrypted data
      const entriesToStore = updatedEntries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        encryptedContent: entry.encryptedContent,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }));
      localStorage.setItem("journalxp_vault_entries", JSON.stringify(entriesToStore));

      showToast({
        title: "Success",
        description: "Entry saved to vault",
      });

      setIsCreatingEntry(false);
      setNewEntryTitle("");
      setNewEntryContent("");
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to save entry",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEntry = async (id: string) => {
    const entry = vaultEntries.find((e) => e.id === id);
    if (!entry) return;

    try {
      const encryptedContent = await encryptData(entry.content);
      const updatedEntries = vaultEntries.map((e) =>
        e.id === id
          ? { ...e, encryptedContent, updatedAt: new Date().toISOString() }
          : e
      );

      setVaultEntries(updatedEntries);

      const entriesToStore = updatedEntries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        encryptedContent: entry.encryptedContent,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }));
      localStorage.setItem("journalxp_vault_entries", JSON.stringify(entriesToStore));

      showToast({
        title: "Success",
        description: "Entry updated",
      });
      setEditingEntry(null);
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to update entry",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = vaultEntries.filter((e) => e.id !== id);
    setVaultEntries(updatedEntries);

    const entriesToStore = updatedEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      encryptedContent: entry.encryptedContent,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));
    localStorage.setItem("journalxp_vault_entries", JSON.stringify(entriesToStore));

    showToast({
      title: "Success",
      description: "Entry deleted",
    });
  };

  const handleChangePassword = async () => {
    const success = await changePassword(oldPassword, newPasswordForChange);
    if (success) {
      showToast({
        title: "Success",
        description: "Password changed successfully",
      });
      setShowChangePasswordDialog(false);
      setOldPassword("");
      setNewPasswordForChange("");
    } else {
      showToast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const handleRemovePassword = async () => {
    const success = await removePassword(unlockPassword);
    if (success) {
      showToast({
        title: "Success",
        description: "Password protection removed",
      });
      setShowRemoveDialog(false);
      setUnlockPassword("");
      // Clear all vault entries
      localStorage.removeItem("journalxp_vault_entries");
      setVaultEntries([]);
    } else {
      showToast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  // If no password set, show setup screen
  if (!hasPassword) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative"
        role="region"
        aria-label="Secure vault setup"
      >
        {/* Gradient glow behind card */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
          style={{ background: theme.colors.gradient }}
        />

        <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl overflow-hidden">
          {/* Gradient header stripe */}
          <div className="h-1.5" style={{ background: theme.colors.gradient }} />

          {/* Decorative glow orbs */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4"
            style={{ background: theme.colors.primary }}
          />
          <div
            className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-15 translate-y-1/2 -translate-x-1/4"
            style={{ background: theme.colors.secondary }}
          />

          <div className="relative p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: theme.colors.gradient,
                  boxShadow: `0 8px 32px ${theme.colors.primary}40`,
                }}
              >
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: theme.colors.gradient }}
                >
                  Secure Vault
                </h2>
                <p className="text-gray-500">
                  Create a password-protected vault for your most sensitive entries
                </p>
              </div>
            </div>

            {/* Security Info Card */}
            <div className="rounded-xl p-4 mb-6 border bg-amber-50/80 border-amber-200/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-100">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium mb-2 text-gray-800">
                    Important Security Information
                  </p>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: theme.colors.primary }} />
                      Your password is never stored or transmitted
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: theme.colors.primary }} />
                      Data is encrypted in your browser using AES-256
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: theme.colors.primary }} />
                      If you forget your password, vault entries cannot be recovered
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: theme.colors.primary }} />
                      Keep your password safe and memorable
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Password Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="h-12 rounded-xl pr-12 bg-white/60 border-gray-200"
                    aria-label="New password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-lg text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="h-12 rounded-xl bg-white/60 border-gray-200"
                  aria-label="Confirm password"
                />
              </div>

              {/* Password Requirements */}
              <div className="rounded-lg p-3 text-xs bg-gray-50/80 text-gray-500">
                <p className="font-medium mb-2 text-gray-700">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-2 gap-1">
                  <span>• At least 8 characters</span>
                  <span>• One uppercase letter</span>
                  <span>• One lowercase letter</span>
                  <span>• One number</span>
                  <span>• One special character</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={handleSetPassword}
                  disabled={!newPassword || !confirmPassword}
                  className="w-full h-12 rounded-xl text-white font-medium shadow-lg transition-all duration-300"
                  style={{
                    background: theme.colors.gradient,
                    boxShadow: `0 8px 32px ${theme.colors.primary}30`,
                  }}
                  aria-label="Set vault password"
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Set Password & Create Vault
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // If locked, show unlock screen
  if (isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative"
        role="region"
        aria-label="Unlock secure vault"
      >
        {/* Gradient glow behind card */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
          style={{ background: theme.colors.gradient }}
        />

        <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl overflow-hidden">
          {/* Gradient header stripe */}
          <div className="h-1.5" style={{ background: theme.colors.gradient }} />

          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4"
            style={{ background: theme.colors.primary }}
          />

          <div className="relative p-6 sm:p-8">
            {/* Lock Icon Animation */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="relative"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                  style={{ background: theme.colors.primary }}
                />
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: theme.colors.gradient,
                    boxShadow: `0 8px 32px ${theme.colors.primary}40`,
                  }}
                >
                  <Lock className="h-10 w-10 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2
                className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
                style={{ backgroundImage: theme.colors.gradient }}
              >
                Vault Locked
              </h2>
              <p className="text-gray-500">
                Enter your password to access encrypted entries
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unlock-password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="unlock-password"
                    type={showPassword ? "text" : "password"}
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Enter your password"
                    onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                    className="h-12 rounded-xl pr-12 bg-white/60 border-gray-200"
                    aria-label="Vault password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-lg text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={handleUnlock}
                  disabled={!unlockPassword}
                  className="w-full h-12 rounded-xl text-white font-medium shadow-lg transition-all duration-300"
                  style={{
                    background: theme.colors.gradient,
                    boxShadow: `0 8px 32px ${theme.colors.primary}30`,
                  }}
                  aria-label="Unlock vault"
                >
                  <Unlock className="h-5 w-5 mr-2" />
                  Unlock Vault
                </Button>
              </motion.div>

              <div className="h-px w-full my-4 bg-gray-200" />

              <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl transition-colors bg-white/50 border-gray-200 text-gray-500 hover:bg-gray-50"
                    aria-label="Remove password protection"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Password Protection
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Remove Password Protection?</DialogTitle>
                    <DialogDescription>
                      This will delete all vault entries permanently. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all encrypted vault entries. You cannot undo this action.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleRemovePassword}
                          className="rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        >
                          Yes, Remove Protection
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Unlocked vault view
  return (
    <div className="w-full" role="region" aria-label="Secure vault entries">
      {/* Header Card with Glass Morphism */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6"
      >
        <div
          className="absolute inset-0 rounded-2xl blur-xl opacity-15"
          style={{ background: theme.colors.gradient }}
        />
        <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg overflow-hidden">
          {/* Success gradient stripe */}
          <div className="h-1" style={{ background: theme.colors.gradient }} />

          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: theme.colors.gradient,
                    boxShadow: `0 8px 24px ${theme.colors.primary}40`,
                  }}
                >
                  <Unlock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: theme.colors.gradient }}
                  >
                    Secure Vault
                  </h2>
                  <p className="text-sm text-gray-500">Your encrypted personal entries</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className="border-0 shadow-sm px-3 py-1 text-white"
                  style={{ background: theme.colors.gradient }}
                >
                  <Shield className="h-3 w-3 mr-1.5" />
                  Unlocked
                </Badge>

                <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg bg-white/50 border-gray-200 hover:bg-white/70 text-gray-600"
                      aria-label="Change vault password"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Change Vault Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="old-password">Current Password</Label>
                        <Input
                          id="old-password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Current password"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password-change">New Password</Label>
                        <Input
                          id="new-password-change"
                          type="password"
                          value={newPasswordForChange}
                          onChange={(e) => setNewPasswordForChange(e.target.value)}
                          placeholder="New password"
                          className="rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={handleChangePassword}
                        className="w-full rounded-xl text-white"
                        style={{ background: theme.colors.gradient }}
                      >
                        Change Password
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLock}
                  className="rounded-lg bg-white/50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  aria-label="Lock vault"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Entries Section */}
      <div className="space-y-4">
        {!isCreatingEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              onClick={() => setIsCreatingEntry(true)}
              className="w-full h-14 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: theme.colors.gradient,
                boxShadow: `0 8px 32px ${theme.colors.primary}30`,
              }}
              aria-label="Create new vault entry"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Vault Entry
            </Button>
          </motion.div>
        )}

        {isCreatingEntry && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Gradient border effect */}
            <div
              className="absolute -inset-0.5 rounded-2xl opacity-40 blur-sm"
              style={{ background: theme.colors.gradient }}
            />

            <div className="relative rounded-2xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl overflow-hidden">
              {/* Header gradient stripe */}
              <div className="h-1.5" style={{ background: theme.colors.gradient }} />

              {/* Inner decorative glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-15 -translate-y-1/2 translate-x-1/2"
                style={{ background: theme.colors.primary }}
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-10 translate-y-1/2 -translate-x-1/2"
                style={{ background: theme.colors.secondary }}
              />

              <div className="relative p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: theme.colors.gradient }}
                  >
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">New Encrypted Entry</h3>
                    <p className="text-xs text-gray-500">Your content will be encrypted with AES-256</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry-title" className="font-medium text-gray-700">Title</Label>
                  <Input
                    id="entry-title"
                    value={newEntryTitle}
                    onChange={(e) => setNewEntryTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="rounded-xl h-11 bg-white/60 border-gray-200"
                    aria-label="Entry title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry-content" className="font-medium text-gray-700">Content</Label>
                  <Textarea
                    id="entry-content"
                    value={newEntryContent}
                    onChange={(e) => setNewEntryContent(e.target.value)}
                    placeholder="Write your sensitive thoughts here... Everything you write will be encrypted and only accessible with your vault password."
                    className="min-h-[200px] rounded-xl resize-none bg-white/60 border-gray-200"
                    aria-label="Entry content"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSaveEntry}
                    className="flex-1 h-11 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300"
                    style={{ background: theme.colors.gradient }}
                    aria-label="Save vault entry"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save to Vault
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreatingEntry(false);
                      setNewEntryTitle("");
                      setNewEntryContent("");
                    }}
                    variant="outline"
                    className="flex-1 h-11 rounded-xl bg-white/50 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {vaultEntries.length === 0 && !isCreatingEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="relative inline-block">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-25"
                style={{ background: theme.colors.gradient }}
              />
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg flex items-center justify-center">
                <Shield className="h-10 w-10" style={{ color: theme.colors.primary }} />
              </div>
            </div>
            <p className="font-medium text-lg text-gray-700">Your vault is empty</p>
            <p className="text-sm mt-2 text-gray-400">Create your first encrypted entry to get started</p>
          </motion.div>
        )}

        {/* Entry Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {vaultEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative"
            >
              {/* Gradient glow effect on hover */}
              <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-25 blur-lg transition-opacity duration-300"
                style={{ background: theme.colors.gradient }}
              />

              {/* Glass card */}
              <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:bg-white/80">
                {/* Decorative gradient stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: theme.colors.gradient }}
                />

                {/* Inner glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2"
                  style={{ background: theme.colors.primary }}
                />

                <div className="relative p-5">
                  {editingEntry === entry.id ? (
                    <div className="space-y-4">
                      <Input
                        value={entry.title}
                        onChange={(e) =>
                          setVaultEntries(
                            vaultEntries.map((ent) =>
                              ent.id === entry.id ? { ...ent, title: e.target.value } : ent
                            )
                          )
                        }
                        className="bg-white/60 border-gray-200"
                        aria-label="Edit entry title"
                      />
                      <Textarea
                        value={entry.content}
                        onChange={(e) =>
                          setVaultEntries(
                            vaultEntries.map((ent) =>
                              ent.id === entry.id ? { ...ent, content: e.target.value } : ent
                            )
                          )
                        }
                        className="min-h-[150px] bg-white/60 border-gray-200"
                        aria-label="Edit entry content"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateEntry(entry.id)}
                          size="sm"
                          className="text-white shadow-md"
                          style={{ background: theme.colors.gradient }}
                          aria-label="Save changes"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingEntry(null)}
                          variant="outline"
                          size="sm"
                          className="bg-white/50 border-gray-200 hover:bg-gray-50"
                          aria-label="Cancel editing"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                            style={{ background: `${theme.colors.primary}15` }}
                          >
                            <FileText className="h-5 w-5" style={{ color: theme.colors.primary }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-800 truncate">{entry.title}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(entry.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingEntry(entry.id)}
                            className="h-8 w-8 p-0 rounded-lg bg-white/50 text-gray-500"
                            style={{ '--hover-bg': `${theme.colors.primary}15`, '--hover-text': theme.colors.primary } as React.CSSProperties}
                            aria-label="Edit entry"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="h-8 w-8 p-0 rounded-lg bg-white/50 hover:bg-red-100 text-gray-500 hover:text-red-600"
                            aria-label="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content preview */}
                      <div className="relative">
                        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4 leading-relaxed">
                          {entry.content}
                        </p>
                        {entry.content.length > 200 && (
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/70 to-transparent" />
                        )}
                      </div>

                      {/* Footer with encryption badge */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100/50">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Lock className="h-3 w-3" />
                          <span>AES-256 Encrypted</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEntry(entry.id)}
                          className="text-xs h-7 px-2"
                          style={{ color: theme.colors.primary }}
                        >
                          View & Edit
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
