import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20",
        outline: "border border-border text-foreground",
        // Condition badges
        new: "bg-success/10 text-success border border-success/20",
        asNew: "bg-info/10 text-info border border-info/20",
        used: "bg-warning/10 text-warning border border-warning/20",
        // Type badges
        sale: "bg-primary/10 text-primary border border-primary/20",
        exchange: "bg-accent/10 text-accent border border-accent/20",
        donation: "bg-donation/10 text-donation border border-donation/20",
        // Program badges
        pyp: "bg-pyp/10 text-pyp border border-pyp/20 font-semibold",
        myp: "bg-myp/10 text-myp border border-myp/20 font-semibold",
        dp: "bg-dp/10 text-dp border border-dp/20 font-semibold",
        // Status badges
        available: "bg-success/10 text-success border border-success/20",
        reserved: "bg-warning/10 text-warning border border-warning/20",
        completed: "bg-muted text-muted-foreground border border-border",
        expired: "bg-destructive/10 text-destructive border border-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
