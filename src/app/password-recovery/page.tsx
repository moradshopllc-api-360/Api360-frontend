"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthThemeToggle } from "@/components/auth-theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { APP_CONFIG } from "@/config/app-config";
import { Trademark } from "@/components/ui/trademark";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function PasswordRecovery() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    try {
      // Simulate API call for password recovery
      const response = await fetch("/api/auth/password-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Recovery email sent!", {
          description: "Check your email for password reset instructions.",
        });
        router.push("/auth/login");
      } else {
        toast.error("Recovery failed", {
          description: "This email address is not registered in our system.",
        });
      }
    } catch (error) {
      toast.success("Recovery email sent!", {
        description: "Check your email for password reset instructions.",
      });
      // For demo purposes, we'll show success even if API fails
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
          <div className="text-primary-foreground absolute top-7 w-full">
            <div className="flex flex-col items-center">
              <div className="text-primary-foreground [&_img]:invert dark:[&_img]:invert-0">
                <img
                  src="/logos/recovery.svg"
                  alt="Recovery Logo"
                  className="size-60"
                />
              </div>
              <h1 className="text-2xl font-medium relative mt-4">
                Password Recovery
              </h1>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center px-10 lg:top-2/3">
            <div className="text-primary-foreground flex flex-col items-center space-y-4 max-w-md text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Forgot Your Password?</h3>
                <p className="text-sm opacity-90">
                  Don't worry! Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 flex w-full justify-between px-10">
            <div className="text-primary-foreground text-sm">© 2025 Api360<span className="text-xs text-primary-foreground/50 align-super ml-0.5 -mt-1 ">®</span></div>
            <div className="flex items-center gap-2">
              <AuthThemeToggle />
              <LanguageToggle />
            </div>
          </div>

          </div>

        <div className="relative order-1 flex h-full">
          <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-medium">Reset Password</h1>
              <p className="text-muted-foreground text-sm">Enter your email to receive password reset instructions</p>
            </div>

            <div className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>

              <div className="text-muted-foreground text-sm text-center">
                Remember your password?{" "}
                <Link className="text-foreground" href="/auth/login">
                  Back to Login
                </Link>
              </div>
            </div>

            <div className="text-center mt-2">
              <div className="text-muted-foreground text-xs max-w-sm mx-auto">
                <p>
                  We'll send you an email with instructions to reset your password.
                  The link will expire after 24 hours for security reasons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}