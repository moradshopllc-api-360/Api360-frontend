"use client";

import { useEthereumSafety } from "@/hooks/use-ethereum-safety";
import { isEthereumAvailable, getSafeSelectedAddress } from "@/lib/ethereum-safety";

/**
 * Ethereum Safety Test Page
 *
 * This page demonstrates and tests the ethereum safety utilities.
 * It shows how to safely access ethereum properties without causing runtime errors.
 */
export default function EthereumTestPage() {
  const {
    isAvailable,
    isMetaMask,
    selectedAddress,
    isLoading,
    requestAccounts,
    getCurrentAccount,
  } = useEthereumSafety();

  const handleTestDirectAccess = () => {
    // This would normally throw an error on mobile, but is now safe
    console.log("Testing direct access to window.ethereum.selectedAddress");

    try {
      // This should not throw an error anymore
      if (typeof window !== 'undefined' && window.ethereum) {
        const address = window.ethereum.selectedAddress;
        console.log("window.ethereum.selectedAddress:", address);
        alert(`window.ethereum.selectedAddress: ${address || 'undefined'}`);
      } else {
        console.log("window.ethereum is not available");
        alert("window.ethereum is not available");
      }
    } catch (error) {
      console.error("Error accessing window.ethereum.selectedAddress:", error);
      alert(`Error: ${error}`);
    }
  };

  const handleTestSafeAccess = () => {
    console.log("Testing safe access via utility functions");

    const available = isEthereumAvailable();
    const address = getSafeSelectedAddress();

    console.log("Ethereum available:", available);
    console.log("Selected address:", address);

    alert(`Ethereum available: ${available}, Selected address: ${address || 'none'}`);
  };

  const handleRequestAccounts = async () => {
    try {
      const accounts = await requestAccounts();
      console.log("Accounts:", accounts);
      alert(`Connected accounts: ${accounts.join(", ")}`);
    } catch (error) {
      console.error("Failed to request accounts:", error);
      alert(`Failed to request accounts: ${error}`);
    }
  };

  const handleGetCurrentAccount = async () => {
    try {
      const account = await getCurrentAccount();
      console.log("Current account:", account);
      alert(`Current account: ${account || 'none'}`);
    } catch (error) {
      console.error("Failed to get current account:", error);
      alert(`Failed to get current account: ${error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Ethereum Safety Test</h1>
        <p>Loading ethereum safety status...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Ethereum Safety Test</h1>

      <div className="space-y-6">
        {/* Status Display */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Ethereum Safety Status</h2>
          <div className="space-y-2">
            <p><strong>Ethereum Available:</strong> {isAvailable ? "Yes" : "No"}</p>
            <p><strong>MetaMask Installed:</strong> {isMetaMask ? "Yes" : "No"}</p>
            <p><strong>Selected Address:</strong> {selectedAddress || "None"}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Safety Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleTestDirectAccess}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Test Direct window.ethereum Access
            </button>
            <button
              onClick={handleTestSafeAccess}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Test Safe Utility Access
            </button>
            {isAvailable && (
              <>
                <button
                  onClick={handleRequestAccounts}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Request Account Access
                </button>
                <button
                  onClick={handleGetCurrentAccount}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Get Current Account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">What This Tests</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Safe access to <code>window.ethereum.selectedAddress</code> on mobile devices</li>
            <li>Prevents runtime errors when ethereum wallet extensions are not installed</li>
            <li>Provides fallback behavior for unsupported environments</li>
            <li>Demonstrates proper error handling for Web3 interactions</li>
          </ul>
        </div>

        {/* Console Instructions */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Console Testing</h2>
          <p className="text-sm mb-2">
            Open your browser console and run these commands to test safety:
          </p>
          <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded font-mono text-xs">
            <p>// Test direct access (should be safe now)</p>
            <p>window.ethereum?.selectedAddress</p>
            <p>&nbsp;</p>
            <p>// Test utility functions</p>
            <p>{"import('{ getSafeSelectedAddress } from \"@/lib/ethereum-safety\"')"}</p>
            <p>getSafeSelectedAddress()</p>
          </div>
        </div>
      </div>
    </div>
  );
}