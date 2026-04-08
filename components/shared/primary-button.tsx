import React, { type ButtonHTMLAttributes, type PropsWithChildren } from 'react'

type PrimaryButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>

export function PrimaryButton({
  children,
  className = '',
  type = 'button',
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white transition-[transform,background-color] hover:bg-[var(--kc-accent-strong)] active:scale-[0.97] ${className}`.trim()}
      style={{ background: 'var(--kc-accent)' }}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
