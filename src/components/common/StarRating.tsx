"use client";

import { useState, useId } from "react";

/* ─────────────────────────────────────────────
   StarRating – 읽기 전용
   ───────────────────────────────────────────── */
interface StarRatingDisplayProps {
    rating: number;      // 0–5 (소수 가능)
    max?: number;
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    reviewCount?: number;
}

const SIZE_PX = { sm: 12, md: 16, lg: 20 };

export function StarRating({
    rating,
    max = 5,
    size = "md",
    showValue = false,
    reviewCount,
}: StarRatingDisplayProps) {
    const px = SIZE_PX[size];

    return (
        <div className="inline-flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: max }).map((_, i) => {
                    const fill = Math.min(1, Math.max(0, rating - i));
                    return <StarSvg key={i} fill={fill} size={px} />;
                })}
            </div>
            {showValue && (
                <span
                    style={{ fontSize: px * 0.85 }}
                    className="font-semibold text-[var(--color-neutral-900)]"
                >
                    {rating.toFixed(1)}
                </span>
            )}
            {reviewCount !== undefined && (
                <span
                    style={{ fontSize: px * 0.75 }}
                    className="text-[var(--color-neutral-400)]"
                >
                    ({reviewCount.toLocaleString()})
                </span>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   InteractiveStarRating – 클릭 가능
   ───────────────────────────────────────────── */
interface InteractiveStarRatingProps {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    size?: "sm" | "md" | "lg";
}

export function InteractiveStarRating({
    value,
    onChange,
    max = 5,
    size = "lg",
}: InteractiveStarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const px = SIZE_PX[size];
    const display = hovered ?? value;

    return (
        <div className="inline-flex items-center gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onChange(i + 1)}
                    className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    aria-label={`${i + 1}점`}
                >
                    <StarSvg fill={display >= i + 1 ? 1 : 0} size={px} />
                </button>
            ))}
        </div>
    );
}

/* ── SVG Star with partial fill ── */
function StarSvg({ fill, size }: { fill: number; size: number }) {
    const id = useId();
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <defs>
                <linearGradient id={id}>
                    <stop offset={`${fill * 100}%`} stopColor="var(--color-star)" />
                    <stop offset={`${fill * 100}%`} stopColor="var(--color-neutral-200)" />
                </linearGradient>
            </defs>
            <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={`url(#${id})`}
                stroke={fill > 0 ? "var(--color-star)" : "var(--color-neutral-300)"}
                strokeWidth="0.5"
            />
        </svg>
    );
}

export default StarRating;