"use client";

import { Lock, Home, LogIn } from "lucide-react";

import { NavigationButton } from "@/components/ai/AIButton";

export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <Lock className="text-primary mx-auto size-12" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Unauthorized Access</h1>
        <p className="text-muted-foreground mt-4">
          You do not have permission to view the requested content. Please contact the site administrator if you believe
          this is an error.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <NavigationButton
            to="/auth/login"
            redirectTo="/dashboard"
            reason="Unauthorized access attempt - redirect to login"
            variant="default"
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In to Continue
          </NavigationButton>

          <NavigationButton
            to="/"
            reason="Unauthorized access - return to homepage"
            variant="outline"
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Homepage
          </NavigationButton>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Security Notice:</strong> Access to protected areas requires authentication.
            Please sign in with your credentials or contact support if you need assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
