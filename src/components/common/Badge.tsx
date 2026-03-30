import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center gap-1 font-medium rounded-pill transition-fast",
    {
        variants: {
            variant: {
                primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs px-2.5 py-0.5",
                neutral: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] text-xs px-2.5 py-0.5",
                yellow: "bg-amber-50 text-amber-600 text-xs px-2.5 py-0.5",
                live: "bg-[var(--color-primary)] text-white text-[11px] px-2 py-0.5 font-semibold tracking-wide",
                outline: "border border-[var(--color-border)] text-[var(--color-neutral-500)] text-xs px-2.5 py-0.5",
            },
        },
        defaultVariants: { variant: "neutral" },
    }
);

interface BadgeProps
    extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({ variant, className = "", children, ...props }: BadgeProps) {
    return (
        <span className={badgeVariants({ variant, className })} {...props}>
            {children}
        </span>
    );
}

export default Badge;