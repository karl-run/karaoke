import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'

const resolvers = {
  Query: {
    hello: () => 'world',
  },
}

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

const apolloHandler = startServerAndCreateNextHandler(server)
const handler = async (req: Request) => apolloHandler(req)

export { handler as GET, handler as POST }
