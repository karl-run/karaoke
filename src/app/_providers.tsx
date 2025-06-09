'use client'

import * as React from 'react'
import { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import { ApolloProvider } from '@apollo/client'

import { useApolloClient } from '@/graphql/apollo/client'

export function Providers({ children }: PropsWithChildren) {
  const client = useApolloClient()

  return (
    <ApolloProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ApolloProvider>
  )
}
