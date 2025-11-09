"use client";

import { useEffect } from "react";

/**
 * EthereumSafetyProvider Component
 *
 * This component initializes ethereum safety measures to prevent runtime errors
 * on mobile devices where window.ethereum is not available.
 */
export function EthereumSafetyProvider() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      try {
        // Apply global ethereum patch immediately
        import("@/lib/global-ethereum-patch").then(({ applyGlobalEthereumPatch }) => {
          applyGlobalEthereumPatch();
        }).catch((error) => {
          console.warn("Failed to apply global ethereum patch:", error);
        });

        // Then initialize the more comprehensive ethereum safety
        import("@/lib/ethereum-safety").then(({ initializeEthereumSafety }) => {
          initializeEthereumSafety();
        }).catch((error) => {
          console.warn("Failed to initialize ethereum safety:", error);
        });
      } catch (error) {
        console.error("Error setting up ethereum safety:", error);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}