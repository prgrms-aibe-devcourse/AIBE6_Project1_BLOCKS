'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button, { buttonVariants } from '@/components/common/Button'

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

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full h-14',
        'bg-white/95 backdrop-blur-sm',
        'border-b border-[var(--color-border)]',
        'shadow-[var(--shadow-nav)]',
      ].join(' ')}
    >
      <nav className="bg-white docked full-width top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 shadow-sm fixed w-full">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-1.5">
            <div className="text-2xl font-black text-[#FF7676] tracking-tighter">
              Festa<span className="text-[var(--color-neutral-900)]">Plan</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 font-plus-jakarta-sans font-bold tracking-tight text-sm">
            {NAV_ITEMS.map(({ label, href }) => {
              const active =
                pathname === href ||
                (href !== '/' && pathname?.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'px-3 py-1.5 text-  sm rounded-pill transition-fast',
                    active
                      ? 'text-[#FF7676] border-b-2 border-[#FF7676] pb-1 transition-all duration-200'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-[#FF7676] transition-colors transition-all duration-200',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </div>
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search icon */}
            <button
              aria-label="검색"
              className="p-2 rounded-pill text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-100)] transition-fast"
            >
              <SearchIcon />
            </button>

            {/* Bell icon */}
            <button
              aria-label="알림"
              className="material-symbols-outlined text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 p-2 rounded-full transition-all active:scale-95"
              data-icon="notifications"
            >
              <BellIcon />
            </button>

            {/* User / Avatar */}
            <Link href="/mypage">
              <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden border border-zinc-100">
                <img
                  alt="User profile avatar"
                  data-alt="close-up portrait of a smiling young professional man with short dark hair in a bright modern office setting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNkEsONdbjeFMTP1CwY-YcTImej6DSDuf7MrttVxxylcJl6Ps2IMqOLCuzzJLw0YbVkwkpRsRke9x2ecf0GoObXz3-HYIqychkP0UVQGuf4jW_o7VqhzFzL4UaW9hKuXR36X0E5uw7S10jj3NHPHwh8p-jiMmEs_IzV8a1pJXhqM3gbl8gmylI3EBCxb4adXFAaSEAJ0ctxpum_VY7wGHdRIjvAs6iSETk3esEAdMq9qN6apaMb-EsNw79dqutfQWp1A6fPs3I7oQ"
                />
              </div>
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
      </nav>

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
          <Link
            href="/your-path"
            className={buttonVariants({
              variant: 'primary',
              size: 'md',
              fullWidth: true,
            })}
          >
            Your Text
          </Link>
        </div>
      )}
    </header>
  )
}

/* ── Icon Helpers ── */
function SearchIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
function BellIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
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
