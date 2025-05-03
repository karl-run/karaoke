import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { getUser } from 'server/user/user-service'
import { clearUserSession } from 'server/session/session-db'

export async function GET(request: NextRequest) {
  const user = await getUser()

  const cookieStore = await cookies()
  cookieStore.delete({
    name: 'session',
    httpOnly: true,
  })

  if (user?.sessionId == null) {
    return backToRoot(request)
  }

  await clearUserSession(user.sessionId)

  return backToRoot(request)
}

function backToRoot(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/'

  return NextResponse.redirect(url)
}
