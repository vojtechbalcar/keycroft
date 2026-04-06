import React from 'react'

type LinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  [key: string]: unknown
}

const Link = ({ href, children, className, ...props }: LinkProps) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
)

export default Link
