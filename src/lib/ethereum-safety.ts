/**
 * Ethereum Safety Utilities
 *
 * This utility provides safe access to window.ethereum object and prevents
 * runtime errors on mobile devices where ethereum wallet extensions are not available.
 */

/**
 * Safe ethereum interface that matches common ethereum provider methods
 */
interface SafeEthereumProvider {
  selectedAddress?: string;
  isMetaMask?: boolean;
  isConnected?: () => boolean;
  request?: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

/**
 * Safe window interface with optional ethereum property
 */
interface SafeWindow {
  ethereum?: SafeEthereumProvider;
}

/**
 * Get the ethereum provider safely
 * @returns The ethereum provider or null if not available
 */
export function getSafeEthereumProvider(): SafeEthereumProvider | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const safeWindow = window as SafeWindow;

  if (!safeWindow.ethereum) {
    return null;
  }

  // Validate that ethereum has the expected structure
  if (typeof safeWindow.ethereum !== 'object') {
    return null;
  }

  return safeWindow.ethereum;
}

/**
 * Get the selected address safely
 * @returns The selected address or null if not available
 */
export function getSafeSelectedAddress(): string | null {
  const provider = getSafeEthereumProvider();

  if (!provider || typeof provider.selectedAddress !== 'string') {
    return null;
  }

  return provider.selectedAddress;
}

/**
 * Check if ethereum provider is available
 * @returns True if ethereum provider is available
 */
export function isEthereumAvailable(): boolean {
  return getSafeEthereumProvider() !== null;
}

/**
 * Check if MetaMask is installed
 * @returns True if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  const provider = getSafeEthereumProvider();
  return provider?.isMetaMask === true;
}

/**
 * Safe request to ethereum provider
 * @param args - Request arguments
 * @returns Promise that resolves with the result or rejects if not available
 */
export function safeEthereumRequest(args: { method: string; params?: any[] }): Promise<any> {
  const provider = getSafeEthereumProvider();

  if (!provider || typeof provider.request !== 'function') {
    return Promise.reject(new Error('Ethereum provider not available'));
  }

  return provider.request(args);
}

/**
 * Initialize ethereum safety checks and monkey-patch global access if needed
 * This function should be called early in the app lifecycle
 */
export function initializeEthereumSafety(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const safeWindow = window as SafeWindow;

  // If ethereum doesn't exist, create a safe stub to prevent errors
  if (!safeWindow.ethereum) {
    const safeStub: SafeEthereumProvider = {
      get selectedAddress() {
        return undefined;
      },
      get isMetaMask() {
        return false;
      },
      isConnected: () => false,
      request: () => Promise.reject(new Error('Ethereum provider not available')),
      on: () => {},
      removeListener: () => {},
    };

    safeWindow.ethereum = safeStub;
  }

  // Wrap existing ethereum provider to ensure safe access
  const existingProvider = safeWindow.ethereum;

  // Create property descriptor for selectedAddress to prevent direct access errors
  try {
    Object.defineProperty(safeWindow.ethereum, 'selectedAddress', {
      get() {
        if (existingProvider && 'selectedAddress' in existingProvider) {
          return existingProvider.selectedAddress;
        }
        return undefined;
      },
      set(value) {
        if (existingProvider && 'selectedAddress' in existingProvider) {
          (existingProvider as any).selectedAddress = value;
        }
      },
      configurable: true,
      enumerable: true,
    });
  } catch (error) {
    // Property might already be defined or non-configurable, which is fine
    console.warn('Could not define ethereum.selectedAddress safely:', error);
  }
}