"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";

export default function PrivacyPolicyPage() {
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
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Document Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last Modified: 11 July 2025
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="rounded-lg border border-border/50 bg-background p-8 shadow-sm">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-base leading-7 text-muted-foreground mb-6">
                At Api360, accessible from https://api360.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Api360 and how we use it.
              </p>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  When you register for our Services, we collect information that you provide to us, such as your name, email address, and other contact information. We may also collect information about your use of our Services, such as the features you use and the actions you take.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  We use the information we collect to provide, maintain, and improve our Services, to process transactions, and to communicate with you about your account and our Services.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Data Security</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  We take reasonable administrative, technical, and physical measures to protect your personal information from unauthorized access, use, or disclosure.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving marketing communications from us.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground">
                    Api360, Inc.<br />
                    10220 dodge ln, Louisville, Kentucky<br />
                    Email: privacy@api360.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button className="gap-2">
                Get Started
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline">
                View Terms of Service
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
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}