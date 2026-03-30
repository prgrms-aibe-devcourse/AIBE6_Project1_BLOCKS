'use client'

import { buttonVariants } from '@/components/common/Button'
import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

/* ─────────────────────────────────────────────
   Nav items
   ───────────────────────────────────────────── */
const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Planner', href: '/planner' },
    { label: 'Mypage', href: '/mypage' },
]

/* ─────────────────────────────────────────────
   Navbar
   ───────────────────────────────────────────── */
export default function Navbar() {
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    const { user, profile, logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        setMenuOpen(false)
    }

    if (
        !pathname ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/findpwd') ||
        pathname.startsWith('/pwdchange')
    ) {
        return null
    }

    return (
        <header
            className={[
                'sticky top-0 z-50 w-full h-14',
                'bg-white/95 backdrop-blur-sm',
                'border-b border-[var(--color-border)]',
                'shadow-[var(--shadow-nav)]',
            ].join(' ')}
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
                        const active =
                            pathname === href || (href !== '/' && pathname?.startsWith(href))
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={[
                                    'px-3 py-1.5 text-sm rounded-pill transition-fast',
                                    active
                                        ? 'text-primary font-semibold bg-primary-light'
                                        : 'text-[var(--color-neutral-700)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)]',
                                ].join(' ')}
                            >
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-2">
                    {/* 로그인하면 사용자 아바타 아이콘 -> 모달 열림, 아니면 로그인 버튼 */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            <button
                                className={buttonVariants({
                                    variant: 'outline',
                                    size: 'md',
                                })}
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                            {/* User / Avatar */}
                            <button
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'icon',
                                })}
                            >
                                {profile?.picture ? (
                                    <Image
                                        src={profile.picture}
                                        alt="Profile"
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <UserIcon />
                                )}
                            </button>
                        </div>
                    ) : (
                        <Link href={'/login'}>
                            <button
                                className={buttonVariants({
                                    variant: 'primary',
                                    size: 'md',
                                })}
                            >
                                로그인
                            </button>
                        </Link>
                    )}

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
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={[
                                    'px-3 py-2.5 text-sm rounded-card transition-fast',
                                    active
                                        ? 'text-[var(--color-primary)] font-semibold bg-[var(--color-primary-light)]'
                                        : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]',
                                ].join(' ')}
                            >
                                {label}
                            </Link>
                        )
                    })}
                    <hr className="my-1 border-[var(--color-border)]" />
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'md',
                                fullWidth: true,
                            })}
                        >
                            로그아웃
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className={buttonVariants({
                                variant: 'primary',
                                size: 'md',
                                fullWidth: true,
                            })}
                        >
                            로그인 / 회원가입
                        </Link>
                    )}
                </div>
            )}
        </header>
    )
}

/* ── Icon Helpers ── */

function UserIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
function MenuIcon() {
    return (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    )
}
function CloseIcon() {
    return (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    )
}
