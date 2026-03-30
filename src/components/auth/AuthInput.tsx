import { InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  wrapperClassName?: string;
  onIconClick?: () => void;
}

export default function AuthInput({ 
  label, 
  icon, 
  iconPosition = 'left',
  wrapperClassName = '',
  onIconClick,
  ...props 
}: AuthInputProps) {
  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      <label
        className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 ml-1"
        htmlFor={props.id || props.name}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span 
            onClick={onIconClick}
            className={`material-symbols-outlined absolute text-[20px] text-neutral-400 top-1/2 -translate-y-1/2 ${onIconClick ? 'cursor-pointer hover:text-neutral-600 transition-colors' : ''} ${iconPosition === 'left' ? 'left-4' : 'right-4'}`}
          >
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none ${props.className || ''} ${icon ? (iconPosition === 'left' ? 'pl-12 pr-4' : 'pr-12 pl-4') : 'px-4'}`}
        />
      </div>
    </div>
  )
}
