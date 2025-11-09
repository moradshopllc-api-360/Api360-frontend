/**
 * Global type declarations for ethereum safety
 * Ensures TypeScript recognizes window.ethereum and related properties
 */

declare global {
  interface Window {
    ethereum?: {
      selectedAddress?: string;
      isMetaMask?: boolean;
      isConnected?: () => boolean;
      request?: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
      once?: (event: string, handler: (...args: any[]) => void) => void;
      off?: (event: string, handler: (...args: any[]) => void) => void;
      listeners?: (event: string) => Function[];
      removeAllListeners?: (event?: string) => void;
      emit?: (event: string, ...args: any[]) => boolean;
      networkVersion?: string;
      chainId?: string;
      // Add other common ethereum provider properties as needed
    };
    web3?: {
      currentProvider?: any;
      eth?: {
        getAccounts?: () => Promise<string[]>;
        getBalance?: (address: string) => Promise<string>;
        sendTransaction?: (transaction: any) => Promise<any>;
      };
      // Add other web3 properties as needed
    };
  }
}

export {};