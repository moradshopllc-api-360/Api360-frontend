import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface SpinnerButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
  className?: string
}

export function SpinnerButton({
  variant = "default",
  size = "sm",
  children = "Loading...",
  className
}: SpinnerButtonProps) {
  return (
    <Button disabled variant={variant} size={size} className={className}>
      <Spinner />
      {children}
    </Button>
  )
}

// Predefined variations for common use cases
export function ProcessingButton() {
  return <SpinnerButton variant="default">Processing...</SpinnerButton>
}

export function VerifyingButton() {
  return <SpinnerButton variant="outline">Verifying...</SpinnerButton>
}

export function CompletingButton() {
  return <SpinnerButton variant="secondary">Completing...</SpinnerButton>
}