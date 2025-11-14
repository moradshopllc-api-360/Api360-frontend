"use client"

import { signOut } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function LogoutButton() {
  const router = useRouter()
  const { logout: authSignOut } = useAuth()

  const handleLogout = async () => {
    try {
      console.log("🚪 [API360] Initiating complete logout process...")

      // 1. Clear any development mode artifacts
      console.log("🧹 [API360] Cleaning development mode session...")
      localStorage.removeItem('dev-user')
      localStorage.removeItem('dev-mode-visible')

      // 2. Clear any stored auth tokens
      console.log("🧹 [API360] Cleaning authentication tokens...")
      localStorage.removeItem('auth-token')
      sessionStorage.removeItem('auth-token')

      // 3. Perform Supabase sign out
      console.log("🔐 [API360] Signing out from Supabase...")
      await signOut()

      // 4. Clear auth context state
      console.log("🧹 [API360] Clearing auth context state...")
      await authSignOut()

      console.log("✅ [API360] Logout completed successfully")

      // 5. Redirect to login page
      router.push("/auth/login")
    } catch (error) {
      console.error("❌ [API360] Logout error:", error)
      // Even if there's an error, try to redirect to login
      router.push("/auth/login")
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}