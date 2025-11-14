"use client";

import Link from "next/link";
import { ArrowRight, Users, Shield, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";
import { useHydrationWarningSuppression } from "@/hooks/use-hydration-suppression";
import { useDocLogger } from "@/lib/ai/doc-logger";
import { useAIAutowire } from "@/hooks/use-ai-autowire";
import { actions } from "@/lib/ai/actions";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { addLog } = useDocLogger();

  // ActionSpec for automatic redirect to dashboard - use predefined action
  const autoRedirectAction = actions.navigation.autoRedirect;

  // Initialize AI autowire for redirect action
  const { execute: executeRedirect } = useAIAutowire({
    onSuccess: (data) => {
      addLog({
        type: 'success',
        message: 'Auto redirect executed successfully',
        action: 'Auto Redirect',
        data: { redirected_to: '/dashboard/default', user_id: user?.id }
      });
    },
    onError: (error) => {
      addLog({
        type: 'error',
        message: `Auto redirect failed: ${error.message}`,
        action: 'Auto Redirect',
        data: { error: error.message, user_id: user?.id }
      });
      console.error('Auto-redirect error:', error);
    }
  });

  // Suppress specific hydration warnings
  useHydrationWarningSuppression();

  // Auto-redirect effect for authenticated users
  useEffect(() => {
    if (user && !loading && !isRedirecting) {
      setIsRedirecting(true);

      addLog({
        type: 'info',
        message: 'Authenticated user detected on homepage, initiating auto-redirect',
        action: 'Auto Redirect',
        data: {
          user_id: user.id,
          user_email: user.email,
          redirect_target: '/dashboard/default',
          trigger: 'cache_redirect'
        }
      });

      // Execute the auto-redirect action using AI workflow
      const performRedirect = async () => {
        try {
          // Execute the AI360 navigation action - this will handle the navigation
          await executeRedirect(autoRedirectAction, {
            trigger: 'cache_redirect',
            reason: 'Authenticated user landed on homepage via cache',
            user_id: user.id,
            user_email: user.email
          });

        } catch (error) {
          // Log error - the AI system will handle navigation internally
          console.error('Auto-redirect error:', error);
        }
      };

      performRedirect();
    }
  }, [user, loading, isRedirecting, router, addLog, executeRedirect, autoRedirectAction]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirect state for authenticated users
  if (user && isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AP</span>
              </div>
              <span className="font-semibold">{APP_CONFIG.meta.title}</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" disabled>
                Redirecting...
              </Button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Welcome back,
              <span className="block text-primary"> {user.name || user.email?.split('@')[0]}!</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              You're successfully logged in as a <span className="font-semibold text-primary capitalize">Administrator</span>.
              Redirecting you to your dashboard...
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="gap-2" disabled>
                <ArrowRight className="h-4 w-4 animate-pulse" />
                Auto-redirecting to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If user is authenticated but not redirecting (fallback state)
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AP</span>
              </div>
              <span className="font-semibold">{APP_CONFIG.meta.title}</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard/default">
                <Button>Go to Dashboard</Button>
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Welcome back,
              <span className="block text-primary"> {user.name || user.email?.split('@')[0]}!</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              You're successfully logged in as a <span className="font-semibold text-primary capitalize">Administrator</span>.
              Ready to manage your dashboard?
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard/default">
                <Button size="lg" className="gap-2">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AP</span>
            </div>
            <span className="font-semibold">{APP_CONFIG.meta.title}</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Manage Your Team
            <span className="block text-primary">With Confidence</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Streamline your team management with our comprehensive dashboard.
            Track performance, manage resources, and make data-driven decisions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Role Management</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Define and manage user roles with granular permissions.
              Perfect for managers and crew members.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Secure Access</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Enterprise-grade security with encrypted authentication
              and protected user data.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Real-time insights and comprehensive analytics
              to make informed decisions.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="rounded-lg border border-border/50 bg-muted/50 p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of teams already using our platform
              to manage their operations efficiently.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Create Your Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 {APP_CONFIG.meta.title}®. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}