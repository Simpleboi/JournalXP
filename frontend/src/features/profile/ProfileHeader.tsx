import { motion } from "framer-motion";
import { useUserData } from "@/context/UserDataContext";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { storage } from "@/lib/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatJoinDate } from "@shared/utils/date";
import { storeItems } from "@/data/shop";

export const ProfileHeader = () => {
  // Context to use User data
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();
  const { toast } = useToast();

  const [uploading, setUploading] = useState(false);

  // Find the featured badge from store items
  const featuredBadge = userData.featuredBadge
    ? storeItems.badges?.find((badge) => badge.id === userData.featuredBadge)
    : null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      console.log("Upload aborted:", { hasFile: !!file, hasUser: !!user, userId: user?.uid });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      console.log("Starting upload:", { userId: user.uid, fileName: file.name, fileSize: file.size });

      // Create a storage ref: profilePictures/userId
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      console.log("Storage ref created:", storageRef.fullPath);

      // Upload file
      console.log("Uploading file...");
      await uploadBytes(storageRef, file);
      console.log("Upload successful!");

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL obtained:", downloadURL);

      // Update Firestore user document with image URL
      await updateDoc(doc(db, "users", user.uid), {
        profilePicture: downloadURL,
      });

      // Refresh local user data context
      await refreshUserData();

      toast({
        title: "Profile Picture Updated!",
        description: "Your profile picture has been successfully updated",
      });
    } catch (err: any) {
      console.error("Image upload failed:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      console.error("Full error:", JSON.stringify(err, null, 2));

      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getRarityColor = (rarity?: string): string => {
    switch (rarity) {
      case "common":
        return "from-gray-100 to-gray-200 border-gray-300";
      case "rare":
        return "from-blue-100 to-blue-200 border-blue-300";
      case "epic":
        return "from-purple-100 to-purple-200 border-purple-300";
      case "legendary":
        return "from-amber-100 to-amber-200 border-amber-300";
      default:
        return "from-gray-100 to-gray-200 border-gray-300";
    }
  };

  const getRarityTextColor = (rarity?: string): string => {
    switch (rarity) {
      case "common":
        return "text-gray-700";
      case "rare":
        return "text-blue-700";
      case "epic":
        return "text-purple-700";
      case "legendary":
        return "text-amber-700";
      default:
        return "text-gray-700";
    }
  };

  // Avatar Picture
  const avatarUrl =
    userData.profilePicture ||
    `https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1200&q=80`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Picture */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md border-4 border-white overflow-hidden group cursor-pointer"
        >
          <img
            src={avatarUrl}
            alt={userData.username}
            className="w-full h-full object-cover"
          />

          {/* Camera icon overlay - appears on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            ) : (
              <Camera className="h-8 w-8 text-white" />
            )}
          </div>

          {/* Hidden file input */}
          <input
            title="Upload profile picture"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </motion.div>

        {/* User Info - Center section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {userData.username || "User Name"}
          </h2>
          <p className="text-gray-500">
            @{userData.username || "no username yet"}
          </p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {userData.rank}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Level {userData.level}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {userData.streak} Day Streak
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Member since {formatJoinDate(userData.joinDate)}
          </p>
        </div>

        {/* Featured Badge - Right section */}
        {featuredBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center p-4 rounded-xl bg-gradient-to-br ${getRarityColor(featuredBadge.rarity)} border-2 shadow-sm min-w-[120px]`}
          >
            <span className="text-4xl mb-2">{featuredBadge.image}</span>
            <span className={`text-sm font-semibold ${getRarityTextColor(featuredBadge.rarity)} text-center`}>
              {featuredBadge.name}
            </span>
            <span className="text-xs text-gray-500 mt-1 capitalize">
              {featuredBadge.rarity}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
