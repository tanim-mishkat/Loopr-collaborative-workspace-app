"use client";

import { ReactNode, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionLoading } from "@/components/ui/loading";
import { use } from "react";

// Enhanced loading component
const EnhancedLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated logo/icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Connecting to workspace...
          </h3>
          <p className="text-gray-600 text-sm">
            Setting up real-time collaboration
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, retry, retryCount = 0, maxRetries = 3 }) => {
  const canRetry = retryCount < maxRetries;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {error?.type === "UNAUTHORIZED"
                ? "Authentication Failed"
                : error?.type === "FORBIDDEN"
                ? "Access Denied"
                : error?.type === "NETWORK"
                ? "Connection Failed"
                : "Workspace Error"}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {error?.userMessage ||
                "Unable to connect to the workspace. Please try again."}
            </p>

            {retryCount > 0 && (
              <p className="text-xs text-orange-600 mb-2">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}

            {error && (
              <details className="text-xs text-gray-500 bg-gray-100 p-2 rounded cursor-pointer">
                <summary className="font-medium">Technical Details</summary>
                <p className="mt-2">
                  {error.message || "Unknown error occurred"}
                </p>
                {error.code && <p className="mt-1">Error Code: {error.code}</p>}
              </details>
            )}
          </div>

          <div className="w-full space-y-3">
            {canRetry ? (
              <Button onClick={retry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Maximum retry attempts reached. Please refresh the page.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
              </div>
            )}

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Room({ children, params }) {
  const roomId = params?.documentid || "1"; // ✅ safe

  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setError(null);
      setRetryKey((prev) => prev + 1);
      setRetryCount((prev) => prev + 1);

      // Reset retry count after successful connection
      setTimeout(() => {
        setRetryCount(0);
      }, 5000);
    }
  };

  const handleError = (error) => {
    console.error("Liveblocks error:", error);

    // Enhanced error handling with specific error types
    if (
      error.message?.includes("401") ||
      error.message?.includes("Unauthorized")
    ) {
      setError({
        ...error,
        type: "UNAUTHORIZED",
        userMessage:
          "Authentication failed. Please refresh the page and try again.",
      });
    } else if (
      error.message?.includes("403") ||
      error.message?.includes("Forbidden")
    ) {
      setError({
        ...error,
        type: "FORBIDDEN",
        userMessage: "You don't have permission to access this workspace.",
      });
    } else if (
      error.message?.includes("network") ||
      error.message?.includes("fetch")
    ) {
      setError({
        ...error,
        type: "NETWORK",
        userMessage:
          "Network connection failed. Please check your internet connection.",
      });
    } else {
      setError({
        ...error,
        type: "UNKNOWN",
        userMessage: "An unexpected error occurred. Please try again.",
      });
    }
  };

  if (error) {
    return (
      <ErrorFallback
        error={error}
        retry={handleRetry}
        retryCount={retryCount}
        maxRetries={maxRetries}
      />
    );
  }
  const authEndpoint = `/api/liveblocks-auth?roomId=${encodeURIComponent(
    roomId
  )}`;

  return (
    <LiveblocksProvider
      key={retryKey}
      authEndpoint={authEndpoint}
      onError={handleError}
      resolveUsers={async ({ userIds }) => {
        try {
          if (!userIds || userIds.length === 0) {
            return [];
          }

          const q = query(
            collection(db, "LoopUsers"),
            where("email", "in", userIds)
          );
          const querySnapshot = await getDocs(q);
          const userList = [];
          querySnapshot.forEach((doc) => {
            userList.push(doc.data());
          });
          return userList;
        } catch (error) {
          console.error("Error resolving users:", error);
          return [];
        }
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        try {
          const q = query(
            collection(db, "LoopUsers"),
            where("email", "!=", null)
          );
          const querySnapshot = await getDocs(q);
          let userList = [];
          querySnapshot.forEach((doc) => {
            userList.push(doc.data());
          });

          if (text) {
            userList = userList.filter(
              (user) =>
                user.name?.toLowerCase().includes(text.toLowerCase()) ||
                user.email?.toLowerCase().includes(text.toLowerCase())
            );
          }

          return userList.map((user) => user.email);
        } catch (error) {
          console.error("Error resolving mention suggestions:", error);
          return [];
        }
      }}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense
          fallback={
            <ConnectionLoading
              message="Connecting to workspace..."
              submessage="Establishing real-time collaboration"
            />
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
