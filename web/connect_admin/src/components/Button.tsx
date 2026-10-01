import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger'
  isLoading?: boolean
}

export default function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-[--radius-md] font-medium transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[--color-primary] text-white hover:bg-[--color-primary-light] active:bg-[--color-primary-dark]',
    secondary: 'bg-[--color-surface-alt] text-[--color-text-primary] hover:bg-[--color-border]',
    accent: 'bg-[--color-accent] text-white hover:bg-[--color-accent-light] active:bg-[--color-accent-dark]',
    danger: 'bg-[--color-error] text-white hover:bg-red-600 active:bg-red-700',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
