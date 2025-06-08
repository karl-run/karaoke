'use client'

import * as React from 'react'
import { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
