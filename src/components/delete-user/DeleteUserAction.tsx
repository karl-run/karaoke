'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { getUser } from 'server/user/user-service'
import { deleteUserCascading } from 'server/user/user-db'

export async function deleteUserAction() {
  const user = await getUser()
  if (user == null) {
    return {
      error: 'User not found, or user not logged in.',
    }
  }

  await deleteUserCascading(user.userId)

  const cookieStore = await cookies()
  cookieStore.delete({
    name: 'session',
    httpOnly: true,
  })

  redirect('/')
}
