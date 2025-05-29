import { Resolvers } from './resolvers.generated'

export const resolvers: Resolvers = {
  Query: {
    hello: () => 'world',
  },
}
