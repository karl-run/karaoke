import { cookies } from 'next/headers'
import { addDays } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'
import { notFound } from 'next/navigation'

import { createUserSession } from 'server/session/session-db'

import { generate16ByteHex } from 'utils/token'

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const sessionId = generate16ByteHex()

  await createUserSession(sessionId, 'you@example.com', request.headers.get('user-agent') ?? 'unknown')

  cookies().set('session', sessionId, {
    httpOnly: true,
    expires: addDays(new Date(), 30),
  })

  const url = request.nextUrl.clone()
  url.pathname = '/'

  return NextResponse.redirect(url)
}
