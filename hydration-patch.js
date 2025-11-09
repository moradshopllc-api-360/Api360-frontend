// Development-only hydration warning suppression
// This file patches console methods to suppress specific hydration warnings

if (process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Patterns to suppress (safe hydration mismatches)
  const suppressionPatterns = [
    /Warning: Text content did not match/,
    /Warning: Prop `.*` did not match/,
    /Hydration failed/,
    /There was an error while hydrating/,
    /Minified React error #418/,
    /data-darkreader-inline-stroke/,
    /width: "1px"/,
    /height: "1px"/,
    /clip: "rect\(0px, 0px, 0px, 0px\)"/,
  ];

  console.error = (...args) => {
    const message = args[0];
    const messageStr = typeof message === 'string' ? message : String(message);

    // Check if the error matches any suppression pattern
    const shouldSuppress = suppressionPatterns.some(pattern =>
      pattern.test(messageStr)
    );

    if (!shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };

  console.warn = (...args) => {
    const message = args[0];
    const messageStr = typeof message === 'string' ? message : String(message);

    // Check if the warning matches any suppression pattern
    const shouldSuppress = suppressionPatterns.some(pattern =>
      pattern.test(messageStr)
    );

    if (!shouldSuppress) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Log that hydration suppression is active
  console.info('🔧 Hydration warning suppression is active in development');
}