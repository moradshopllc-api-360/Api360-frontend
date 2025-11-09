/**
 * Global Ethereum Patch
 *
 * This script patches global ethereum access to prevent runtime errors on mobile devices.
 * It creates safe property getters and setters that handle undefined ethereum gracefully.
 */

interface GlobalWindow {
  ethereum?: any;
  // Add any other potential global ethereum properties
  web3?: any;
}

/**
 * Apply global ethereum safety patch
 * This should be called as early as possible in the app lifecycle
 */
export function applyGlobalEthereumPatch(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const globalWindow = window as GlobalWindow;

  // Patch window.ethereum if it doesn't exist
  if (!globalWindow.ethereum) {
    Object.defineProperty(globalWindow, 'ethereum', {
      get() {
        // Return a safe stub that mimics ethereum interface
        return createSafeEthereumStub();
      },
      set(value) {
        // Allow setting of ethereum but wrap it for safety
        Object.defineProperty(globalWindow, '_ethereum', {
          value: value,
          writable: true,
          configurable: true,
          enumerable: false,
        });
      },
      configurable: true,
      enumerable: true,
    });
  } else {
    // If ethereum exists, patch selectedAddress property to be safe
    patchEthereumProperty(globalWindow.ethereum);
  }

  // Also patch web3 if it exists or could exist
  if (!globalWindow.web3) {
    Object.defineProperty(globalWindow, 'web3', {
      get() {
        return createSafeWeb3Stub();
      },
      configurable: true,
      enumerable: true,
    });
  }
}

/**
 * Create a safe ethereum stub object
 */
function createSafeEthereumStub() {
  return {
    get selectedAddress() {
      return undefined;
    },
    set selectedAddress(value) {
      // No-op for safety
    },
    get isMetaMask() {
      return false;
    },
    isConnected: () => false,
    request: async () => Promise.reject(new Error('Ethereum provider not available')),
    on: () => {},
    removeListener: () => {},
    once: () => {},
    off: () => {},
    listeners: () => [],
    removeAllListeners: () => {},
    emit: () => false,
    // Add other common ethereum properties as needed
    networkVersion: undefined,
    chainId: undefined,
  };
}

/**
 * Create a safe web3 stub object
 */
function createSafeWeb3Stub() {
  return {
    currentProvider: null,
    eth: {
      getAccounts: async () => [],
      getBalance: async () => '0',
      sendTransaction: async () => ({ hash: '0x' }),
    },
    // Add other web3 methods as needed
  };
}

/**
 * Patch existing ethereum object for safety
 */
function patchEthereumProperty(ethereum: any): void {
  if (!ethereum || typeof ethereum !== 'object') {
    return;
  }

  // Patch selectedAddress if it doesn't exist or could cause errors
  if (!('selectedAddress' in ethereum)) {
    Object.defineProperty(ethereum, 'selectedAddress', {
      get() {
        return undefined;
      },
      set(value) {
        // Store value safely if possible
        Object.defineProperty(ethereum, '_selectedAddress', {
          value,
          writable: true,
          configurable: true,
          enumerable: false,
        });
      },
      configurable: true,
      enumerable: true,
    });
  } else {
    // Wrap existing selectedAddress getter to be safe
    const originalDescriptor = Object.getOwnPropertyDescriptor(ethereum, 'selectedAddress');
    if (originalDescriptor) {
      Object.defineProperty(ethereum, 'selectedAddress', {
        get() {
          try {
            if (originalDescriptor.get) {
              return originalDescriptor.get.call(ethereum);
            }
            return originalDescriptor.value;
          } catch (error) {
            console.warn('Error accessing ethereum.selectedAddress:', error);
            return undefined;
          }
        },
        set(value) {
          try {
            if (originalDescriptor.set) {
              originalDescriptor.set.call(ethereum, value);
            } else if (originalDescriptor.writable) {
              originalDescriptor.value = value;
            }
          } catch (error) {
            console.warn('Error setting ethereum.selectedAddress:', error);
          }
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
}

/**
 * Initialize global patching immediately if in browser
 * Also patch it as soon as possible during module loading
 */
if (typeof window !== 'undefined') {
  // Apply immediately
  applyGlobalEthereumPatch();

  // Also patch after a small delay to catch any late initialization
  setTimeout(applyGlobalEthereumPatch, 0);

  // Patch one more time after DOM content is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGlobalEthereumPatch);
  }
}