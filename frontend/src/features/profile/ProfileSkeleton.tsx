import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Shimmer animation for skeleton elements
const shimmer = {
  hidden: { opacity: 0.5 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

// Profile header skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Banner skeleton */}
      <motion.div
        className="h-40 md:h-56 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
        variants={shimmer}
        initial="hidden"
        animate="visible"
      />

      {/* Profile content skeleton */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
          {/* Avatar skeleton */}
          <div className="-mt-16 md:-mt-20">
            <Skeleton className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white" />
          </div>

          {/* User info skeleton */}
          <div className="flex-1 text-center md:text-left space-y-2 pt-4">
            <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
            <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
            <div className="flex gap-2 justify-center md:justify-start">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="flex gap-6 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-7 w-12 mx-auto mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab navigation skeleton
export function TabsSkeleton() {
  return (
    <div className="flex gap-2 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-10 w-28 rounded-lg" />
      ))}
    </div>
  );
}

// Stats grid skeleton
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="bg-white rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Level progress skeleton
export function LevelProgressSkeleton() {
  return (
    <motion.div
      className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-xl p-6 mb-6"
      variants={shimmer}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-white/30" />
          <Skeleton className="h-10 w-16 bg-white/30" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-4 w-16 bg-white/30 ml-auto" />
          <Skeleton className="h-6 w-24 bg-white/30" />
        </div>
      </div>
      <Skeleton className="h-3 w-full bg-white/30 rounded-full" />
    </motion.div>
  );
}

// Recent activity skeleton
export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Trophy case skeleton
export function TrophyCaseSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Shelf skeleton */}
      <div className="space-y-6">
        {[1, 2].map((shelf) => (
          <div key={shelf} className="bg-gray-50 rounded-xl p-4">
            <Skeleton className="h-3 w-20 mb-3" />
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4, 5].map((badge) => (
                <Skeleton
                  key={badge}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-lg"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Full profile page skeleton
export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      {/* Header skeleton */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Skeleton className="h-10 w-10 rounded-lg mr-3" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-9 rounded-full ml-auto" />
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <ProfileHeaderSkeleton />
        <TabsSkeleton />
        <LevelProgressSkeleton />
        <StatsGridSkeleton />
        <ActivitySkeleton />
      </main>
    </div>
  );
}

export default ProfilePageSkeleton;
