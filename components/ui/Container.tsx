import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Container = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-w-7xl mx-auto px-4 md:px-6 lg:px-8", className)}
    {...props}
  />
));
Container.displayName = "Container";
