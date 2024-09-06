import { notFound } from 'next/navigation'

import { getUser } from 'server/user/user-service'

export async function getVerifiedAdmin() {
  const user = await getUser()
  if (!user) {
    notFound()
  }

  if (process.env.ADMIN_ID == null) {
    console.error('ADMIN_ID is not configured, admin page is inaccessible')
    notFound()
  }

  if (user.userId !== process.env.ADMIN_ID) {
    notFound()
  }

  return user
}
