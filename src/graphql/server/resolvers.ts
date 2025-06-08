import * as R from 'remeda'

import { getUserBangers } from 'server/bangers/bangers-service'

import { Resolvers } from './resolvers.generated'

export const resolvers: Resolvers = {
  Query: {
    bangers: async (_, __, ctx) => {
      const bangers = await getUserBangers(ctx.user.userId)
      return R.map(bangers, R.last())
    },
  },
}
