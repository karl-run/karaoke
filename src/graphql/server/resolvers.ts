import * as R from 'remeda'
import { notFound } from 'next/navigation'

import { getUserBangers } from 'server/bangers/bangers-service'
import { usersShareGroup } from 'server/user/user-db'
import { getOtherUser } from 'server/user/user-service'

import { assertUserLoggedIn } from '@/graphql/server/errors'

import { Resolvers } from './resolvers.generated'

export const resolvers: Resolvers = {
  Query: {
    bangers: async (_, __, ctx) => {
      assertUserLoggedIn(ctx.user)

      const bangers = await getUserBangers(ctx.user.userId)

      return R.map(bangers, R.last())
    },
    otherUser: async (_, { safeId }, ctx) => {
      assertUserLoggedIn(ctx.user)

      const otherUser = await getOtherUser(safeId)

      if (otherUser == null) return null

      if (!(await usersShareGroup(ctx.user.userId, otherUser.userId))) {
        console.error('User does not share group with group member, sneaky!')
        notFound()
      }

      return {
        safeId: otherUser.safeId,
        name: otherUser.name,
      }
    },
  },
  OtherUser: {
    bangers: async (parent) => {
      const otherUser = await getOtherUser(parent.safeId)
      if (otherUser == null) return null

      const bangers = await getUserBangers(otherUser?.userId)
      return R.map(bangers, R.last())
    },
  },
}
