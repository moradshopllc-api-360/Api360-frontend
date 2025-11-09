import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { LoadingProvider } from "@/contexts/loading-context";
import { AIWorkflowProvider } from "@/components/ai/AIWorkflowProvider";
import { Toaster } from "@/components/ui/sonner";
import { EthereumSafetyProvider } from "@/components/ethereum-safety-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { DevelopmentModeAuth } from "@/components/auth/development-mode-auth";
import { GlobalSpinner } from "@/components/ui/global-spinner";
import { APP_CONFIG } from "@/config/app-config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemePreset, type ThemeMode } from "@/types/preferences/theme";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");

  return (
    <html
      lang="en"
      className={themeMode === "dark" ? "dark" : ""}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <body className={`${inter.className} min-h-screen antialiased`} suppressHydrationWarning>
        <EthereumSafetyProvider />
        <ErrorBoundary>
          <AIWorkflowProvider>
            <LoadingProvider>
              <AuthProvider>
                <LanguageProvider>
                  <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
                    {children}
                    <GlobalSpinner />
                    <Toaster />
                    <DevelopmentModeAuth />
                  </PreferencesStoreProvider>
                </LanguageProvider>
              </AuthProvider>
            </LoadingProvider>
          </AIWorkflowProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
