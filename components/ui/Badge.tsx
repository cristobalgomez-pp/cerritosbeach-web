import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "peach"
  | "ocean"
  | "neutral"
  | "success"
  | "warning"
  | "danger";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  peach: "bg-peach text-ink",
  ocean: "bg-ocean text-foam",
  neutral: "bg-cream text-ink border border-border",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
