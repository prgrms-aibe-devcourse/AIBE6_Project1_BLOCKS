import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-neutral-50)] mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[var(--color-primary)] font-bold text-base tracking-tight">
            Festa<span className="text-[var(--color-neutral-900)]">Plan</span>
          </span>
          <p className="text-xs text-[var(--color-neutral-400)] max-w-xs leading-relaxed">
            축제를 중심으로 최적의 여행 플랜을 AI가 만들어드립니다.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--color-neutral-500)]">
          {[
            { label: "서비스 소개", href: "/about" },
            { label: "이용약관",   href: "/terms" },
            { label: "개인정보처리방침", href: "/privacy" },
            { label: "공지사항",   href: "/notice" },
            { label: "고객센터",   href: "/support" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="hover:text-[var(--color-primary)] transition-fast">
              {label}
            </Link>
          ))}
        </nav>

        {/* Copy */}
        <p className="text-xs text-[var(--color-neutral-400)]">
          © {new Date().getFullYear()} FestaPlан. All rights reserved.
        </p>
      </div>
    </footer>
  );
}