import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WifiOff, Wifi, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export function OfflineIndicator() {
  const { isOnline, isSyncing, queuedCount, syncQueue, clearQueue } = useOfflineSync({
    onSync: (succeededCount, failedCount) => {
      if (succeededCount > 0) {
        showToast({
          title: "Sync Complete",
          description: `${succeededCount} ${succeededCount === 1 ? "entry" : "entries"} synced successfully`,
        });
      }
      if (failedCount > 0) {
        showToast({
          title: "Sync Failed",
          description: `${failedCount} ${failedCount === 1 ? "entry" : "entries"} failed to sync`,
        });
      }
    },
  });

  const { showToast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  if (isOnline && queuedCount === 0) {
    return null; // Don't show anything when online with no queued items
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 shadow-lg border-2">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-600" aria-label="Online" />
          ) : (
            <WifiOff className="h-5 w-5 text-orange-600" aria-label="Offline" />
          )}

          {/* Status Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={isOnline ? "bg-green-600" : "bg-orange-600 text-white"}
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>

              {queuedCount > 0 && (
                <Badge variant="outline" className="border-orange-600 text-orange-600">
                  {queuedCount} queued
                </Badge>
              )}

              {isSyncing && (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              )}
            </div>

            {!isOnline && (
              <p className="text-xs text-gray-600 mt-1">
                Changes will sync when connection is restored
              </p>
            )}

            {isOnline && queuedCount > 0 && !isSyncing && (
              <p className="text-xs text-gray-600 mt-1">
                Ready to sync pending changes
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isOnline && queuedCount > 0 && !isSyncing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => syncQueue()}
                className="gap-1"
                aria-label="Sync now"
              >
                <RefreshCw className="h-3 w-3" />
                Sync Now
              </Button>
            )}

            {queuedCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDetails(!showDetails)}
                aria-label={showDetails ? "Hide details" : "Show details"}
              >
                {showDetails ? "Hide" : "Details"}
              </Button>
            )}
          </div>
        </div>

        {/* Details Panel */}
        {showDetails && queuedCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Queued Actions:</span>
                <span className="font-medium">{queuedCount}</span>
              </div>

              <div className="flex gap-2 mt-3">
                {isOnline && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={async () => {
                      const result = await syncQueue();
                      if (result && result.succeededCount > 0) {
                        setShowDetails(false);
                      }
                    }}
                    disabled={isSyncing}
                    className="flex-1 gap-1"
                    aria-label="Sync all queued actions"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Sync All
                      </>
                    )}
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear all queued changes? This cannot be undone."
                      )
                    ) {
                      clearQueue();
                      setShowDetails(false);
                      showToast({
                        title: "Queue Cleared",
                        description: "All pending changes have been removed",
                      });
                    }
                  }}
                  className="flex-1 gap-1"
                  aria-label="Clear all queued actions"
                >
                  <XCircle className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
