"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button, { buttonVariants } from "@/components/common/Button";

/* ─────────────────────────────────────────────
   Nav items
   ───────────────────────────────────────────── */
const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Planner", href: "/planner" },
    { label: "Mypage", href: "/mypage" },
];

/* ─────────────────────────────────────────────
   Navbar
   ───────────────────────────────────────────── */
export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className={[
                "sticky top-0 z-50 w-full h-14",
                "bg-white/95 backdrop-blur-sm",
                "border-b border-[var(--color-border)]",
                "shadow-[var(--shadow-nav)]",
            ].join(" ")}
        >
            <div className="mx-auto max-w-6xl h-full px-4 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="shrink-0 flex items-center gap-1.5">
                    <span className="text-[var(--color-primary)] font-bold text-lg tracking-tight select-none">
                        Festa<span className="text-[var(--color-neutral-900)]">Plan</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_ITEMS.map(({ label, href }) => {
                        const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={[
                                    "px-3 py-1.5 text-sm rounded-pill transition-fast",
                                    active
                                        ? "text-primary font-semibold bg-primary-light"
                                        : "text-[var(--color-neutral-700)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)]",
                                ].join(" ")}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-2">
                    {/* Bell icon */}
                    <button
                        aria-label="알림"
                        className="p-2 rounded-pill text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-100)] transition-fast"
                    >
                        <BellIcon />
                    </button>

                    {/* User / Avatar */}
                    <Link href="/mypage">
                        <button
                            aria-label="마이페이지"
                            className="p-2 rounded-pill text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-100)] transition-fast"
                        >
                            <UserIcon />
                        </button>
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    aria-label="메뉴"
                    className="md:hidden p-2 rounded-pill text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)] transition-fast"
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-[var(--color-border)] shadow-[var(--shadow-modal)] animate-slide-down px-4 py-3 flex flex-col gap-1 z-50">
                    {NAV_ITEMS.map(({ label, href }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={[
                                    "px-3 py-2.5 text-sm rounded-card transition-fast",
                                    active
                                        ? "text-[var(--color-primary)] font-semibold bg-[var(--color-primary-light)]"
                                        : "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]",
                                ].join(" ")}
                            >
                                {label}
                            </Link>
                        );
                    })}
                    <hr className="my-1 border-[var(--color-border)]" />
                    <Link
                        href="/your-path"
                        className={buttonVariants({ variant: "primary", size: "md", fullWidth: true })}
                    >
                        Your Text
                    </Link>
                </div>
            )}
        </header>
    );
}

/* ── Icon Helpers ── */
function SearchIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}
function BellIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function UserIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function MenuIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}
function CloseIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}