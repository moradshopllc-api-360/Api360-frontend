"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";

export default function PrivacyPage() {
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
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last Modified: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Privacy Content */}
          <div className="rounded-lg border border-border/50 bg-background p-8 shadow-sm">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-base leading-7 text-muted-foreground mb-6">
                At {APP_CONFIG.meta.title}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our services.
              </p>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  We collect various types of information to provide and improve our services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and account credentials</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our platform</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, and access times</li>
                  <li><strong>Cookies and Tracking:</strong> Data collected through cookies and similar technologies</li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Data Protection and Security</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure data storage and access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Limited employee access to personal data</li>
                  <li>Secure authentication and authorization mechanisms</li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Your Privacy Rights</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request removal of your personal data</li>
                  <li><strong>Portability:</strong> Transfer your data to another service</li>
                  <li><strong>Objection:</strong> Object to processing of your data</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Sharing and Third Parties</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>Service providers who assist in operating our platform</li>
                  <li>Legal requirements or court orders</li>
                  <li>Business transfers or mergers</li>
                  <li>Protection of rights, property, or safety</li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. International Data Transfers</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  Your personal information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Children's Privacy</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such information, we will take steps to delete it promptly.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Changes to This Policy</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Modified" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact Information</h2>
                <p className="text-base leading-7 text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or want to exercise your rights, please contact us:
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground">
                    {APP_CONFIG.meta.title}<br />
                    10220 dodge ln, Louisville, Kentucky<br />
                    Email: privacy@{APP_CONFIG.name.toLowerCase()}.com<br />
                    Phone: (555) 123-4567
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