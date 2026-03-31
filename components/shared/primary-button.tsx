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
      className={`inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)] ${className}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
