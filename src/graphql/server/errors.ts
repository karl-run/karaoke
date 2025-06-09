import { GraphQLError } from 'graphql/error'
import { ApolloError } from '@apollo/client'

import { ContextUser } from '@/graphql/server/context'

export function userNotLoggedIn(): never {
  throw new GraphQLError('Not logged in', {
    extensions: { code: 'UNAUTHENTICATED' },
  })
}

export function assertUserLoggedIn(user: ContextUser | null): asserts user is ContextUser {
  if (user == null) {
    userNotLoggedIn()
  }
}

export function isUserNotLoggedIn(error: ApolloError): boolean {
  return error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')
}
