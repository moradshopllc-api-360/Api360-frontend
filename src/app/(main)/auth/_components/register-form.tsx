"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientOnly } from "@/components/ui/client-only";
import { LocationSearchButton } from "@/components/locations/location-search-button";
import { AirlineCallsignCombobox, type AirlineSelection } from "@/components/ui/airline-combobox";
import { Airport } from "@/types/airports";
import { AIButton } from "@/components/ai/AIButton";
import { useAIAutowire } from "@/hooks/use-ai-autowire";
import { createRegisterActionSpec } from "@/lib/ai/actions";

const FormSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
    role: z.enum(["admin", "crew"], { message: "Please select a role." }),
    phone: z.string().optional(),
    airline: z.string().optional(), // Will store the airline value
    airlineSelection: z.any().optional(), // Will store the AirlineSelection object
    manager_location: z.any().optional(), // Will be populated with single Airport object
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.role === "admin") {
      return data.manager_location !== null && data.manager_location !== undefined;
    }
    return true;
  }, {
    message: "Location is required for Manager role.",
    path: ["manager_location"],
  })
  .refine((data) => {
    if (data.role === "crew") {
      return data.airline !== undefined && data.airline !== "";
    }
    return true;
  }, {
    message: "Airline is required for Crew Member role.",
    path: ["airline"],
  });

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<Airport | null>(null);
  const [selectedAirline, setSelectedAirline] = React.useState<AirlineSelection | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      phone: "",
      airline: "",
      airlineSelection: null,
      manager_location: null,
    },
  });

  const selectedRole = form.watch("role");

  // Update form value when selectedLocation changes
  React.useEffect(() => {
    form.setValue("manager_location", selectedLocation);
  }, [selectedLocation, form]);

  const handleLocationSelect = (airport: Airport) => {
    setSelectedLocation(airport);
  };

  const handleLocationRemove = () => {
    setSelectedLocation(null);
    form.setValue("manager_location", null);
  };

  // Update form value when selectedAirline changes
  React.useEffect(() => {
    form.setValue("airline", selectedAirline ? `${selectedAirline.code}-${selectedAirline.name}` : "");
    form.setValue("airlineSelection", selectedAirline);
  }, [selectedAirline, form]);

  const handleAirlineSelect = (value: string, selection?: AirlineSelection) => {
    setSelectedAirline(selection || null);
  };

  // Clear location and airline when role changes
  React.useEffect(() => {
    if (selectedRole !== "admin") {
      setSelectedLocation(null);
      form.setValue("manager_location", null);
    }
    if (selectedRole !== "crew") {
      setSelectedAirline(null);
      form.setValue("airline", "");
      form.setValue("airlineSelection", null);
    }
  }, [selectedRole, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    try {
      // Prepare registration data
      const registrationData = {
        email: data.email,
        password: data.password,
        role: data.role,
        metadata: {
          role: data.role,
          ...(data.role === "admin" && {
            manager_location: selectedLocation,
            phone: data.phone,
          }),
          ...(data.role === "crew" && {
            airline: selectedAirline,
            phone: data.phone,
          }),
        },
      };

      // Register with Supabase
      await signUpWithEmail(
        registrationData.email,
        registrationData.password,
        JSON.stringify(registrationData.metadata)
      );

      // Log successful registration with role-specific details
      if (data.role === "admin") {
        console.log(`Manager registered with location:`,
          selectedLocation ? `${selectedLocation.code} - ${selectedLocation.name}` : "No location selected");
      } else if (data.role === "crew") {
        console.log(`Crew Member registered with airline:`,
          selectedAirline ? `${selectedAirline.code} - ${selectedAirline.name}` : "No airline selected");
      }

      const roleDisplay = data.role === "admin" ? "Manager" : "Crew Member";
      toast.success("Account created successfully!", {
        description: `Welcome! You are registered as a ${roleDisplay}. Please check your email to verify your account.`,
      });

      // Redirect to login page after successful registration
      router.push("/auth/login");
    } catch (error) {
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // AI workflow for registration
  const registerActionSpec = React.useMemo(() => createRegisterActionSpec(), []);

  const { execute: executeRegister, loading: aiLoading } = useAIAutowire({
    onSuccess: (data) => {
      console.log("Registration AI workflow completed:", data);
    },
    onError: (error) => {
      console.error("Registration AI workflow failed:", error);
      toast.error("AI workflow failed", {
        description: error.message,
      });
    },
  });

  return (
    <ClientOnly fallback={<div className="animate-pulse space-y-4">
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-10 bg-muted rounded"></div>
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
                <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Role and dependent inputs */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-0">
          <div className="w-full md:w-[220px]">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Choose Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Manager</SelectItem>
                      <SelectItem value="crew">Crew Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Locations Button for Managers */}
          {selectedRole === "admin" && (
            <div className="w-full md:flex-1 md:-ml-26">
              <FormField
                name="manager_location"
                render={() => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <LocationSearchButton
                        selectedLocation={selectedLocation}
                        onLocationSelect={(a: Airport) => {
                          setSelectedLocation(a);
                          form.setValue("manager_location", a);
                        }}
                        onLocationRemove={() => {
                          setSelectedLocation(null);
                          form.setValue("manager_location", null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Airline Selection for Crew Members */}
          {selectedRole === "crew" && (
            <div className="w-full md:flex-1 md:-ml-18">
              <FormField
                name="airline"
                render={() => (
                  <FormItem>
                    <FormLabel>Airline</FormLabel>
                    <FormControl>
                      <AirlineCallsignCombobox
                        value={form.watch("airline")}
                        onValueChange={handleAirlineSelect}
                        placeholder="Select your airline..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Phone Number Field (shown for both roles) */}
        {selectedRole && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    autoComplete="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          className="w-full"
          type="submit"
          disabled={isLoading || aiLoading}
          onClick={async (e) => {
            e.preventDefault();
            const formData = form.getValues();

            try {
              // Execute AI workflow logging
              await executeRegister(registerActionSpec, {
                email: formData.email,
                role: formData.role,
                ...(formData.role === "admin" && {
                  manager_location: selectedLocation,
                  phone: formData.phone,
                }),
                ...(formData.role === "crew" && {
                  airline: selectedAirline,
                  phone: formData.phone,
                }),
              });

              // Then submit the form
              await form.handleSubmit(onSubmit)();
            } catch (error) {
              console.error("Registration failed:", error);
            }
          }}
        >
          {isLoading || aiLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
    </ClientOnly>
  );
}
