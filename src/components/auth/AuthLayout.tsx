export default function AuthLayout({ 
  children, 
  className = '', 
  hasTopAccent = false, 
  isWide = false 
}: { 
  children: React.ReactNode, 
  className?: string, 
  hasTopAccent?: boolean, 
  isWide?: boolean 
}) {
  return (
    <div className="bg-neutral-50 text-neutral-900 min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-12 z-10 w-full">
        <div className={`w-full ${isWide ? 'max-w-md md:p-10 p-8' : 'max-w-[440px] p-8'} bg-white rounded-xl border ${isWide ? 'border-neutral-300' : 'border-neutral-200'} shadow-card relative overflow-hidden ${className}`}>
          {/* Decorative Accent */}
          {hasTopAccent && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
          {children}
        </div>
      </main>
    </div>
  )
}
