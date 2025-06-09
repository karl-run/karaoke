import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { useRef } from 'react'

export function createApolloClient() {
  const httpLink = createHttpLink({
    uri: '/api/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
    ssrMode: false,
  })

  return client
}

export function useApolloClient() {
  const clientRef = useRef<ApolloClient<NormalizedCacheObject>>(undefined)

  if (!clientRef.current) {
    clientRef.current = createApolloClient()
  }

  return clientRef.current
}
