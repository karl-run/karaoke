import { makeExecutableSchema } from '@graphql-tools/schema'

import { typeDefs } from '@/graphql/server/type-defs'
import { resolvers } from '@/graphql/server/resolvers'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
