import { redirect } from 'next/navigation'

import { createMagicLinkForUser } from 'server/user/user-login-service'

export async function magicLoginLinkAction(data: FormData) {
  'use server'

  const email = data.get('email')?.toString()

  if (!email) {
    throw new Error('Email is required')
  }

  await createMagicLinkForUser(email)

  redirect('/login/success')
}
