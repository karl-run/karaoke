import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { addDays, differenceInMinutes, isBefore, subMinutes } from 'date-fns'

import { clearUserLoginState, getFullLoginUserByEmail } from 'server/user/user-db'
import { createUserSession, setUserVerified } from 'server/session/session-db'
import { isUserInGroup } from 'server/group/group-db'

import { generate16ByteHex, hashWithSalt } from '@/utils/token'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const token = params.get('token')

  if (!token) {
    return NextResponse.redirect('/login/fail')
  }

  const { email, actualToken } = decodeToken(token)
  const user = await getFullLoginUserByEmail(email)

  if (!user || user.loginTimestamp == null || user.loginSalt == null) {
    console.warn('User not found')
    return toLoginFail(request)
  }

  if (isBefore(user.loginTimestamp, subMinutes(new Date(), 10))) {
    console.warn('Login link expired', new Date(), user.loginTimestamp)
    console.warn(`Link was ${differenceInMinutes(new Date(), user.loginTimestamp)} minutes old`)
    return toLoginFail(request)
  }

  if (hashWithSalt(actualToken, user.loginSalt) !== user.loginHash) {
    console.warn('Login link tampered with')
    return toLoginFail(request)
  }

  const sessionId = generate16ByteHex()
  await createUserSession(sessionId, user.email, request.headers.get('user-agent') ?? 'unknown')

  if (!user.verified) {
    await setUserVerified(user.email)
  }

  const cookieStore = await cookies()
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    expires: addDays(new Date(), 30),
  })

  await clearUserLoginState(user.email)

  const lastInviteLinkValue = cookieStore.get('I have been invited')
  if (lastInviteLinkValue != null && !(await isUserInGroup(user.email, lastInviteLinkValue.value))) {
    return toInviteLink(request, lastInviteLinkValue.value)
  }

  if (lastInviteLinkValue != null) {
    cookieStore.delete({
      name: 'I have been invited',
      httpOnly: true,
    })
  }

  return backToRoot(request)
}

function decodeToken(token: string): {
  email: string
  actualToken: string
} {
  const [actualToken, base64Email] = token.split('.')
  const email = Buffer.from(base64Email, 'base64').toString('utf-8')

  return { email, actualToken }
}

function backToRoot(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.searchParams.delete('token')

  return NextResponse.redirect(url)
}

function toLoginFail(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/login/fail'
  url.searchParams.delete('token')

  return NextResponse.redirect(url)
}

function toInviteLink(request: NextRequest, inviteCode: string) {
  const url = request.nextUrl.clone()
  url.pathname = '/groups/join'
  url.searchParams.delete('token')
  url.searchParams.set('code', inviteCode)

  return NextResponse.redirect(url)
}
