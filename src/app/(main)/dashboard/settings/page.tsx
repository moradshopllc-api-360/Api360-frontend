'use client'

import { Settings, Palette, Layout, Monitor, Smartphone, Bell, Shield, Database, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { updateContentLayout, updateNavbarStyle } from "@/lib/layout-utils";
import { updateThemeMode, updateThemePreset } from "@/lib/theme-utils";
import { setValueToCookie } from "@/server/server-actions";
import {
  SIDEBAR_VARIANT_OPTIONS,
  SIDEBAR_COLLAPSIBLE_OPTIONS,
  CONTENT_LAYOUT_OPTIONS,
  NAVBAR_STYLE_OPTIONS,
  type SidebarVariant,
  type SidebarCollapsible,
  type ContentLayout,
  type NavbarStyle,
} from "@/types/preferences/layout";
import { THEME_PRESET_OPTIONS, type ThemeMode } from "@/types/preferences/theme";

export default function SettingsPage() {
  // Theme preferences
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);

  const handleValueChange = async (key: string, value: any) => {
    if (key === "theme_mode") {
      updateThemeMode(value);
      setThemeMode(value as ThemeMode);
    }

    if (key === "theme_preset") {
      updateThemePreset(value);
      setThemePreset(value as any);
    }

    if (key === "content_layout") {
      updateContentLayout(value);
    }

    if (key === "navbar_style") {
      updateNavbarStyle(value);
    }

    if (key === "sidebar_variant") {
      // Update sidebar variant
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        sidebar.setAttribute("data-variant", value);
      }
    }

    if (key === "sidebar_collapsible") {
      // Update sidebar collapsible
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        sidebar.setAttribute("data-collapsible", value);
      }
    }

    await setValueToCookie(key, value);
  };

  return (
    <div className="container mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          
        </div>
      </div>

      <div className="grid gap-6">

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>
              Manage your account settings and security preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Organization Profile</p>
                  <p className="text-xs text-muted-foreground">
                    Update your name, email, and profile picture
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-xs text-muted-foreground">
                    Change your password and security settings
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how and when you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive updates and alerts via email
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Browser notifications for important updates
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize the visual appearance and theme of your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Theme Preset</Label>
                <Select value={themePreset} onValueChange={(value) => handleValueChange("theme_preset", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEME_PRESET_OPTIONS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className="size-3 rounded-full"
                            style={{
                              backgroundColor: themeMode === "dark" ? preset.primary.dark : preset.primary.light,
                            }}
                          />
                          {preset.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Theme Mode</Label>
                <ToggleGroup
                  className="w-full"
                  variant="outline"
                  type="single"
                  value={themeMode}
                  onValueChange={(value) => handleValueChange("theme_mode", value)}
                >
                  <ToggleGroupItem value="light" className="flex-1">
                    <Monitor className="mr-2 h-4 w-4" />
                    Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" className="flex-1">
                    <Monitor className="mr-2 h-4 w-4" />
                    Dark
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              <CardTitle>Layout</CardTitle>
            </div>
            <CardDescription>
              Configure the layout and navigation behavior of your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sidebar Variant</Label>
                <ToggleGroup
                  className="w-full"
                  variant="outline"
                  type="single"
                  onValueChange={(value) => handleValueChange("sidebar_variant", value)}
                >
                  {SIDEBAR_VARIANT_OPTIONS.map((variant) => (
                    <ToggleGroupItem key={variant.value} value={variant.value} className="flex-1">
                      {variant.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sidebar Collapsible</Label>
                <ToggleGroup
                  className="w-full"
                  variant="outline"
                  type="single"
                  onValueChange={(value) => handleValueChange("sidebar_collapsible", value)}
                >
                  {SIDEBAR_COLLAPSIBLE_OPTIONS.map((collapsible) => (
                    <ToggleGroupItem key={collapsible.value} value={collapsible.value} className="flex-1">
                      {collapsible.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Navbar Style</Label>
                <ToggleGroup
                  className="w-full"
                  variant="outline"
                  type="single"
                  onValueChange={(value) => handleValueChange("navbar_style", value)}
                >
                  {NAVBAR_STYLE_OPTIONS.map((style) => (
                    <ToggleGroupItem key={style.value} value={style.value} className="flex-1">
                      {style.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Content Layout</Label>
                <ToggleGroup
                  className="w-full"
                  variant="outline"
                  type="single"
                  onValueChange={(value) => handleValueChange("content_layout", value)}
                >
                  {CONTENT_LAYOUT_OPTIONS.map((layout) => (
                    <ToggleGroupItem key={layout.value} value={layout.value} className="flex-1">
                      {layout.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        

        {/* AI360 Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>AI360 Integration</CardTitle>
            </div>
            <CardDescription>
              Access workflow management, API testing tools, and documentation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Workflow Settings</p>
                <p className="text-xs text-muted-foreground">
                  Manage AI360 workflow configuration, API testing, and documentation
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings-workflow" className="flex items-center gap-2">
                  Open Workflow Settings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Advanced</CardTitle>
            </div>
            <CardDescription>
              Advanced configuration options and system settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Data & Privacy</p>
                  <p className="text-xs text-muted-foreground">
                    Export your data and manage privacy settings
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Developer Tools</p>
                  <p className="text-xs text-muted-foreground">
                    Access developer options and debugging tools
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}