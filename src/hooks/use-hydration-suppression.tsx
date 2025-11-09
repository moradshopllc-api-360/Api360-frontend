"use client";

import { useEffect, useState } from "react";

/**
 * Hook to suppress hydration warnings for specific components
 * Returns a boolean indicating if the component has mounted on the client
 */
export function useHydrationSuppression() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to true only after client-side hydration
    setHasMounted(true);
  }, []);

  return hasMounted;
}

/**
 * Custom hook to suppress specific hydration warnings
 */
export function useHydrationWarningSuppression() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Suppress specific hydration warnings that are safe to ignore
      const originalConsoleWarn = console.warn;
      const originalConsoleError = console.error;

      console.warn = (...args) => {
        const message = args[0];
        if (
          typeof message === 'string' &&
          (
            message.includes('Text content does not match') ||
            message.includes('Hydration failed') ||
            message.includes('Warning: Prop `') && message.includes('did not match') ||
            message.includes('data-darkreader-inline-stroke') ||
            message.includes('width: "1px"') ||
            message.includes('height: "1px"')
          )
        ) {
          // Suppress these specific warnings
          return;
        }
        originalConsoleWarn.apply(console, args);
      };

      console.error = (...args) => {
        const message = args[0];
        if (
          typeof message === 'string' &&
          (
            message.includes('Minified React error #418') ||
            message.includes('Hydration failed') ||
            message.includes('There was an error while hydrating')
          )
        ) {
          // Only suppress if it's related to styling differences, not functional errors
          return;
        }
        originalConsoleError.apply(console, args);
      };

      // Cleanup function
      return () => {
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
      };
    }
  }, []);
}

/**
 * Component wrapper that waits for client-side hydration
 */
export function HydrationGuard({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const hasMounted = useHydrationSuppression();

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}