"use client";

import { ReactNode, useEffect } from "react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";
import { AuthThemeToggle } from "@/components/auth-theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";

// Apply global ethereum patch immediately for auth pages
if (typeof window !== 'undefined') {
  import("@/lib/global-ethereum-patch").then(({ applyGlobalEthereumPatch }) => {
    applyGlobalEthereumPatch();
  }).catch(() => {
    // Silently fail - this is just a safety patch
  });
}

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useLanguage();
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
          <div className="text-primary-foreground absolute top-7 w-full">
            <div className="flex flex-col items-center">
              <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0">
                <img
                  src="/logos/logo-api360.svg"
                  alt="API360 Logo"
                  className="size-60"
                />
              </div>
             
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8">
            <div className="flex w-full justify-between px-10 mt-35">
              <div className="text-primary-foreground flex flex-1 flex-col items-center space-y-2">
                <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0">
                  <img
                    src="/logos/manager.svg"
                    alt="Avion Logo"
                    className="size-20"
                  />
                </div>
                <h3 className="font-medium">Manager</h3>
              </div>
              <Separator
                orientation="vertical"
                className="shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-3 !h-32 bg-white dark:bg-black"
              />
              <div className="text-primary-foreground flex flex-1 flex-col items-center space-y-2">
                <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0">
                  <img
                    src="/logos/driver.svg"
                    alt="Driver Logo"
                    className="size-20"
                  />
                </div>
                <h3 className="font-medium">Driver</h3>
              </div>
              <Separator
                orientation="vertical"
                className="shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-3 !h-32 bg-white dark:bg-black"
              />
              <div className="text-primary-foreground flex flex-1 flex-col items-center space-y-2">
                <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0">
                  <img
                    src="/logos/crews.svg"
                    alt="Crew Member Logo"
                    className="size-20"
                  />
                </div>
                <h3 className="font-medium">Crew Member</h3>
              </div>
            </div>
           
          </div>

  
          <div className="absolute bottom-4 md:bottom-5 lg:bottom-5 flex w-full justify-between px-4 md:px-6 lg:px-10">
            <div className="text-xs md:text-sm text-primary-foreground" dangerouslySetInnerHTML={{ __html: APP_CONFIG.copyright }}></div>
            <div className="flex items-center gap-2">
              <AuthThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
