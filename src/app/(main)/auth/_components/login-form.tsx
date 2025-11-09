"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ClientOnly } from "@/components/ui/client-only";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRecoveryLinks, setShowRecoveryLinks] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    try {
      await signInWithEmail(data.email, data.password);

      toast.success("Login successful!", {
        description: "Welcome back to your dashboard.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed", {
        description: "Invalid email or password",
      });
      setShowRecoveryLinks(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientOnly fallback={<div className="animate-pulse space-y-4">
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-10 bg-muted rounded"></div>
    </div>}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...field} />
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
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
    </ClientOnly>
  );
}
