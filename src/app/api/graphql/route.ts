import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

import { getUser } from 'server/user/user-service'

import { schema } from '@/graphql/server/schema'
import { GqlContext } from '@/graphql/server/context'

const server = new ApolloServer({
  schema,
})

const apolloHandler = startServerAndCreateNextHandler(server, {
  context: async (): Promise<GqlContext> => {
    return { user: await getUser() }
  },
})

const handler = async (req: Request) => apolloHandler(req)

export { handler as GET, handler as POST }
