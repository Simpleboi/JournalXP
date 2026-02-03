import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";
import { isPasswordStrong } from "@/utils/encryption";
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
      <Card className="w-full" role="region" aria-label="Secure vault setup">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Secure Vault
          </CardTitle>
          <CardDescription>
            Create a password-protected vault for your most sensitive journal entries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important Security Information</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Your password is never stored or transmitted</li>
                  <li>Data is encrypted in your browser using AES-256</li>
                  <li>If you forget your password, vault entries cannot be recovered</li>
                  <li>Keep your password safe and memorable</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a strong password"
                aria-label="New password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              aria-label="Confirm password"
            />
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-medium">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>At least 8 characters long</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>

          <Button
            onClick={handleSetPassword}
            className="w-full"
            disabled={!newPassword || !confirmPassword}
            aria-label="Set vault password"
          >
            <Lock className="h-4 w-4 mr-2" />
            Set Password & Create Vault
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If locked, show unlock screen
  if (isLocked) {
    return (
      <Card className="w-full" role="region" aria-label="Unlock secure vault">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-600" />
            Vault Locked
          </CardTitle>
          <CardDescription>Enter your password to access encrypted entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unlock-password">Password</Label>
            <div className="relative">
              <Input
                id="unlock-password"
                type={showPassword ? "text" : "password"}
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                placeholder="Enter your password"
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                aria-label="Vault password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleUnlock}
            className="w-full"
            disabled={!unlockPassword}
            aria-label="Unlock vault"
          >
            <Unlock className="h-4 w-4 mr-2" />
            Unlock Vault
          </Button>

          <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" aria-label="Remove password protection">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Password Protection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Password Protection?</DialogTitle>
                <DialogDescription>
                  This will delete all vault entries permanently. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all encrypted vault entries. You cannot undo this action.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemovePassword} className="bg-red-600">
                      Yes, Remove Protection
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // Unlocked vault view
  return (
    <Card className="w-full" role="region" aria-label="Secure vault entries">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Secure Vault</CardTitle>
              <CardDescription>Your encrypted personal entries</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-600">
              <Shield className="h-3 w-3 mr-1" />
              Unlocked
            </Badge>
            <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Change vault password">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="w-full">
                    Change Password
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleLock} aria-label="Lock vault">
              <Lock className="h-4 w-4 mr-2" />
              Lock
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCreatingEntry && (
          <Button
            onClick={() => setIsCreatingEntry(true)}
            className="w-full"
            aria-label="Create new vault entry"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Vault Entry
          </Button>
        )}

        {isCreatingEntry && (
          <Card className="border-2 border-indigo-200 bg-indigo-50">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entry-title">Title</Label>
                <Input
                  id="entry-title"
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  placeholder="Entry title"
                  aria-label="Entry title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entry-content">Content</Label>
                <Textarea
                  id="entry-content"
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  placeholder="Write your sensitive thoughts here..."
                  className="min-h-[200px]"
                  aria-label="Entry content"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEntry} className="flex-1" aria-label="Save vault entry">
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
                  className="flex-1"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {vaultEntries.length === 0 && !isCreatingEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl" />
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg flex items-center justify-center">
                <Shield className="h-10 w-10 text-indigo-500" />
              </div>
            </div>
            <p className="text-gray-600 font-medium text-lg">Your vault is empty</p>
            <p className="text-sm text-gray-400 mt-2">Create your first encrypted entry to get started</p>
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />

              {/* Glass card */}
              <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-indigo-100/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-200/50 group-hover:bg-white/80">
                {/* Decorative gradient stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

                {/* Inner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

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
                        className="bg-white/50 border-white/60 focus:border-indigo-300"
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
                        className="min-h-[150px] bg-white/50 border-white/60 focus:border-indigo-300"
                        aria-label="Edit entry content"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateEntry(entry.id)}
                          size="sm"
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
                          aria-label="Save changes"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingEntry(null)}
                          variant="outline"
                          size="sm"
                          className="bg-white/50 border-white/60 hover:bg-white/70"
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
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                            <FileText className="h-5 w-5 text-indigo-600" />
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
                            className="h-8 w-8 p-0 rounded-lg bg-white/50 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600"
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
                          className="text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 h-7 px-2"
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
      </CardContent>
    </Card>
  );
}
