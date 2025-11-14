"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginForm } from "@/hooks/use-forms";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ClientOnly } from "@/components/ui/client-only";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRecoveryLinks, setShowRecoveryLinks] = React.useState(false);

  // Get any success/error messages from URL params
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  const { form, onSubmit, loading, isSubmitting } = useLoginForm();

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    const result = await onSubmit(data);

    if (result.success) {
      toast.success("Login successful!", {
        description: "Welcome back to your dashboard.",
      });
      router.push("/dashboard");
    } else {
      toast.error("Login failed", {
        description: result.error || "Invalid email or password",
      });
      setShowRecoveryLinks(true);
    }
  };

  // Show toast messages from URL params
  React.useEffect(() => {
    if (message) {
      switch (message) {
        case 'check-email':
          toast.info("Email Verification Required", {
            description: "Please check your email for a verification link.",
          });
          break;
        case 'password-reset-sent':
          toast.success("Password Reset Sent", {
            description: "Please check your email for password reset instructions.",
          });
          break;
        case 'password-reset-success':
          toast.success("Password Reset Successful", {
            description: "Your password has been reset successfully.",
          });
          break;
      }
    }

    if (error) {
      toast.error("Authentication Error", {
        description: error === 'session_expired'
          ? "Your session has expired. Please log in again."
          : "An error occurred. Please try again.",
      });
    }
  }, [message, error]);

  return (
    <ClientOnly fallback={
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
        <div className="h-10 bg-muted rounded"></div>
      </div>
    }>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4" suppressHydrationWarning>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            type="submit"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      {showRecoveryLinks && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2" suppressHydrationWarning>
          <p className="text-sm text-muted-foreground text-center">
            Having trouble accessing your account?
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/password-recovery">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Reset Password
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Additional helpful links */}
      <div className="mt-6 text-center space-y-2">
        

        {/* Development mode indicator */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-muted-foreground">
            Development Mode - Using mock authentication
          </p>
        )}
      </div>
    </ClientOnly>
  );
}