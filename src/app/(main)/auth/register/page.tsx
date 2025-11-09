"use client";

import Link from "next/link";

import { useLanguage } from "@/contexts/language-context";
import { RegisterForm } from "../_components/register-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function RegisterPage() {
  const { t } = useLanguage();
  return (
    <>
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6 md:space-y-8 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">{t("Get started")}</h1>
          <p className="text-muted-foreground text-sm">{t("Create a new account")}</p>
        </div>
        <div className="space-y-4">
          <GoogleButton className="w-full" />
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">{t("or")}</span>
          </div>
          <RegisterForm />
          <div className="text-muted-foreground text-sm text-center">
            Have an account?{" "}
            <Link className="text-foreground" href="login">
              Sign In Now
            </Link>
          </div>
        </div>

        <div className="text-center mt-2">
          <div className="text-muted-foreground text-xs max-w-sm mx-auto">
            <p>
              By continuing, you agree to Api360's{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , and to receive periodic emails with updates.
            </p>
            <p className="mt-2">
              Need help?{" "}
              <Link href="/support" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
