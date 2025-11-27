export default function ExperimentalFeatureNotice() {
  return (
    <div className="w-full rounded-xl border border-yellow-400/40 bg-yellow-50/70 dark:bg-yellow-900/20 p-4 md:p-5 mt-4 shadow-sm mx-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-1">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M4.93 19.07a10 10 0 1 1 14.14 0 10 10 0 0 1-14.14 0Z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1">
          <h2 className="font-semibold text-yellow-700 dark:text-yellow-300 text-lg">
            Experimental Feature
          </h2>
          <p className="text-sm text-yellow-700/80 dark:text-yellow-300/90 leading-relaxed mt-1">
            This section of JournalXP is currently experimental. You may
            encounter bugs, unexpected behavior, or incomplete functionality.
            Please use it with caution and share feedback so we can improve the
            experience.
          </p>
        </div>
      </div>
    </div>
  );
}
