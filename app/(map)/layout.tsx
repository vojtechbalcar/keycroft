import type { ReactNode } from 'react'

export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #05091a 0%, #080e20 50%, #0b1228 100%)',
      color: '#e6edf3',
    }}>
      {children}
    </div>
  )
}
