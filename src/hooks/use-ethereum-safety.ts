"use client";

import { useState, useEffect } from "react";
import {
  getSafeEthereumProvider,
  getSafeSelectedAddress,
  isEthereumAvailable,
  isMetaMaskInstalled,
  safeEthereumRequest,
} from "@/lib/ethereum-safety";

/**
 * React hook for safe ethereum access
 * Provides reactive state for ethereum availability and selected address
 */
export function useEthereumSafety() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isMetaMask, setIsMetaMask] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check ethereum availability on mount and when window.ethereum might change
    const checkEthereum = () => {
      setIsLoading(false);
      setIsAvailable(isEthereumAvailable());
      setIsMetaMask(isMetaMaskInstalled());
      setSelectedAddress(getSafeSelectedAddress());
    };

    checkEthereum();

    // Set up event listeners for account changes if ethereum is available
    const provider = getSafeEthereumProvider();
    if (provider && provider.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        setSelectedAddress(accounts[0] || null);
      };

      // Listen for account changes
      provider.on("accountsChanged", handleAccountsChanged);

      return () => {
        // Cleanup event listeners
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, []);

  /**
   * Safely request account access
   */
  const requestAccounts = async (): Promise<string[]> => {
    try {
      const accounts = await safeEthereumRequest({ method: "eth_requestAccounts" });
      return accounts;
    } catch (error) {
      console.error("Failed to request accounts:", error);
      throw error;
    }
  };

  /**
   * Safely get current account
   */
  const getCurrentAccount = async (): Promise<string | null> => {
    try {
      const accounts = await safeEthereumRequest({ method: "eth_accounts" });
      return accounts[0] || null;
    } catch (error) {
      console.error("Failed to get current account:", error);
      return null;
    }
  };

  return {
    isAvailable,
    isMetaMask,
    selectedAddress,
    isLoading,
    requestAccounts,
    getCurrentAccount,
    safeRequest: safeEthereumRequest,
  };
}