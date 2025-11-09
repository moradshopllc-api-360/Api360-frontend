import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/ui/client-only";
import { cn } from "@/lib/utils";
import { GoogleOAuthButton } from "@/components/ai/AIButton";
import "@/styles/social-buttons.css";

interface GoogleButtonProps extends Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> {
  redirectTo?: string;
  onSuccess?: (data: any) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
}

export function GoogleButton({
  className,
  redirectTo,
  onSuccess,
  variant = "outline",
  size = "default",
  ...props
}: GoogleButtonProps) {
  return (
    <GoogleOAuthButton
      redirectTo={redirectTo}
      onSuccess={onSuccess}
      variant={variant}
      size={size}
      className={cn("google-social-button social-auth-button", className)}
      {...props}
    >
      <div className="social-button-icon mr-0">
        <ClientOnly
          fallback={
            <div className="social-button-fallback size-4" />
          }
        >
          <SimpleIcon
            icon={siGoogle}
            className="size-4"
          />
        </ClientOnly>
      </div>
      <span className="social-button-content">
        Continue with Google
      </span>
    </GoogleOAuthButton>
  );
}

// Export the original button for backward compatibility (non-functional)
export function GoogleButtonVisual({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" className={cn(className)} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}
