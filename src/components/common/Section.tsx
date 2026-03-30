/* ── Section Card wrapper ── */
export function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] card-shadow p-6 ${className}`}>
            {children}
        </div>
    )
}