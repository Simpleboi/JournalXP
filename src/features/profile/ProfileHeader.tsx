import { motion } from "framer-motion";
import { useUserData } from "@/context/UserDataContext";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { storage } from "@/lib/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { useState } from "react";

export const ProfileHeader = () => {
  // Context to use User data
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      // Create a storage ref: profilePictures/userId
      const storageRef = ref(storage, `profilePictures/${user.uid}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore user document with image URL
      await updateDoc(doc(db, "users", user.uid), {
        profilePicture: downloadURL,
      });

      // Refresh local user data context
      await refreshUserData();
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
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
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md border-4 border-white overflow-hidden"
        >
          <img
            src={avatarUrl}
            alt={userData.username}
            className="w-full h-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </motion.div>

        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {userData.username || "User Name"}
          </h2>
          <p className="text-gray-500">
            @{userData.username || "no username yet"}
          </p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
            {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {userData.rank}
            </span> */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Level {userData.level}
            </span>
            {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {userData.streak} Day Streak
            </span> */}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Member since {userData.joinDate}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
