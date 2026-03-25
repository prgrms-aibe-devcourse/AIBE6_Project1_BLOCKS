"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

/* ─────────────────────────────────────────────
   Button Variants (CVA)
   ───────────────────────────────────────────── */
const buttonVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-1.5",
    "font-medium rounded-pill",
    "transition-all duration-[var(--transition-base)]",
    "cursor-pointer select-none whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        /** 기본 Primary – 주요 CTA */
        primary: [
          "bg-[var(--color-primary)] text-white",
          "hover:bg-[var(--color-primary-dark)] active:scale-[0.97]",
          "shadow-[0_2px_8px_rgba(242,101,101,0.35)]",
        ].join(" "),

        /** 보조 Secondary – 카카오 등 소셜 */
        secondary: [
          "bg-[var(--color-secondary)] text-neutral-900",
          "hover:brightness-95 active:scale-[0.97]",
        ].join(" "),

        /** Outline – 취소, 덜 강조 */
        outline: [
          "bg-white border border-[var(--color-border)] text-[var(--color-neutral-700)]",
          "hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
          "active:scale-[0.97]",
        ].join(" "),

        /** Ghost – 텍스트 버튼 */
        ghost: [
          "bg-transparent text-[var(--color-neutral-700)]",
          "hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-primary)]",
          "active:scale-[0.97]",
        ].join(" "),

        /** Danger */
        danger: [
          "bg-red-500 text-white",
          "hover:bg-red-600 active:scale-[0.97]",
        ].join(" "),
      },
      size: {
        sm:  "text-xs px-3 py-1.5 h-8",
        md:  "text-sm px-4 py-2 h-9",
        lg:  "text-sm px-6 py-2.5 h-10",
        xl:  "text-base px-8 py-3 h-12",
        icon: "p-2 h-9 w-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/* ─────────────────────────────────────────────
   Props
   ───────────────────────────────────────────── */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant,
      size,
      fullWidth,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

/* ── Inline Spinner ── */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export { Button, buttonVariants };
export default Button;