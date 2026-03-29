import Link from 'next/link'

export default function AuthHeader({ 
  title, 
  subtitle, 
  isLogo = false 
}: { 
  title: React.ReactNode, 
  subtitle: string, 
  isLogo?: boolean 
}) {
  return (
    <div className="mb-10 text-center mt-4">
      {isLogo ? (
        <Link href="/">
          <h1
            className="text-4xl font-black text-neutral-900 tracking-tighter mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h1>
        </Link>
      ) : (
        <h1
          className="text-3xl font-bold tracking-tight mb-3 text-neutral-900"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
      )}
      <p className="text-neutral-500 text-sm leading-relaxed font-medium tracking-tight">
        {subtitle}
      </p>
    </div>
  )
}
