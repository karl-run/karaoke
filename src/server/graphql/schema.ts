import { makeExecutableSchema } from '@graphql-tools/schema'

const resolvers = {
  Query: {
    hello: () => 'world',
  },
}

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String
  }
`
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
