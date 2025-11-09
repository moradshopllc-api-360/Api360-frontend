"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last Modified: 11 July 2025
            </p>
          </div>

          {/* Terms Content */}
          <div className="rounded-lg border border-border/50 bg-background p-8 shadow-sm">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-base leading-7 text-muted-foreground mb-6">
                These Terms of Service (this &quot;Agreement&quot;) are a binding contract between you (&quot;Customer,&quot; &quot;you,&quot; or &quot;your&quot;) and Supabase, Inc., a Delaware corporation with offices located at 10220 dodge ln, Louisville, Kentucky (&quot;Api360,&quot; &quot;we,&quot; or &quot;us&quot;). This Agreement governs your access to and use of the Cloud Services. Api360 and Customer may be referred to herein collectively as the &quot;Parties&quot; or individually as a &quot;Party.&quot;
              </p>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  By accessing and using this Service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Use License</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  Permission is granted to temporarily download one copy of the materials on Api360's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Disclaimer</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  The materials on Api360's website are provided on an 'as is' basis. Api360 makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Limitations</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  In no event shall Api360 or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Api360's website, even if Api360 or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Privacy Policy</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  Your Privacy is important to us. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Revisions and Errata</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  The materials appearing on Api360's website could include technical, typographical, or photographic errors. Api360 does not warrant that any of the materials on its website are accurate, complete, or current. Api360 may make changes to the materials contained on its website at any time without notice.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Information</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  Questions about the Terms of Service should be sent to us at:
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground">
                    Api360, Inc.<br />
                    10220 dodge ln, Louisville, Kentucky<br />
                    Email: legal@api360.com
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
            <Link href="/policy">
              <Button variant="outline">
                View Privacy Policy
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