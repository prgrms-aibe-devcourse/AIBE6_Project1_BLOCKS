'use client'
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  iconText?: string
}

export default function AuthButton({
  children,
  loading = false,
  loadingText = '처리 중...',
  iconText,
  ...props
}: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full mt-4 bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all flex justify-center items-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${props.className || ''}`}
    >
      <span>{loading ? loadingText : children}</span>
      {!loading && iconText && (
        <span className="material-symbols-outlined text-[20px]">
          {iconText}
        </span>
      )}
    </button>
  )
}
