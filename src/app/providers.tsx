'use client'

import { ThemeProvider } from 'next-themes'
// import { Toaster } from '@/components/ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute='class'
      defaultTheme='system'
      disableTransitionOnChange
    >
      {children}
      {/* <ToasterProvider /> */}
    </ThemeProvider>
  )
}