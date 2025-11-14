"use client";

import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import { SectionCards } from "./_components/section-cards";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { NavigationButton } from "@/components/ai/AIButton";
import { Lock } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Security check: redirect unauthorized users
  useEffect(() => {
    if (!loading && !user) {
      console.warn('🚨 [SECURITY] Unauthorized access to dashboard default page - redirecting to login');
      router.push('/auth/login?redirect_to=/dashboard/default');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="max-w-md text-center p-6">
          <Lock className="text-primary mx-auto size-12 mb-4" />
          <h2 className="text-lg font-semibold text-red-600 mb-2">Authentication Required</h2>
          <p className="text-muted-foreground text-sm mb-4">
            You need to be authenticated to access the dashboard.
          </p>
          <NavigationButton
            to="/auth/login"
            redirectTo="/dashboard/default"
            reason="Dashboard access required"
            variant="default"
            className="w-full"
          >
            Sign In to Continue
          </NavigationButton>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute
      requireAuth={true}
      fallback={
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground text-sm">Verifying access...</p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto flex flex-col gap-4 md:gap-6">
        <SectionCards />
        <ChartAreaInteractive />
        <DataTable data={data} />
      </div>
    </ProtectedRoute>
  );
}