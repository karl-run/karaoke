import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addDays, differenceInMinutes, isBefore, subMinutes } from 'date-fns';

import { clearUserLoginState, getUserByEmail } from '@/server/db/users';
import { generate16ByteHex, hashWithSalt } from '@/utils/token';
import { createUserSession, setUserVerified } from '@/server/db/sessions';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const token = params.get('token');

  if (!token) {
    return NextResponse.redirect('/login/fail');
  }

  const { email, actualToken } = decodeToken(token);
  const user = await getUserByEmail(email);

  if (!user || user.login_timestamp == null || user.login_salt == null) {
    console.warn('User not found');
    return toLoginFail(request);
  }

  if (isBefore(user.login_timestamp, subMinutes(new Date(), 10))) {
    console.warn('Login link expired', new Date(), user.login_timestamp);
    console.warn(`Link was ${differenceInMinutes(new Date(), user.login_timestamp)} minutes old`);
    return toLoginFail(request);
  }

  if (hashWithSalt(actualToken, user.login_salt) !== user.login_hash) {
    console.warn('Login link tampered with');
    return toLoginFail(request);
  }

  const sessionId = generate16ByteHex();
  await createUserSession(sessionId, user.email, request.headers.get('user-agent') ?? 'unknown');

  if (!user.verified) {
    await setUserVerified(user.email);
  }

  cookies().set('session', sessionId, {
    httpOnly: true,
    expires: addDays(new Date(), 30),
  });

  await clearUserLoginState(user.email);

  return backToRoot(request);
}

function decodeToken(token: string): {
  email: string;
  actualToken: string;
} {
  const [actualToken, base64Email] = token.split('.');
  const email = Buffer.from(base64Email, 'base64').toString('utf-8');

  return { email, actualToken };
}

function backToRoot(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.searchParams.delete('token');

  return NextResponse.redirect(url);
}

function toLoginFail(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/login/fail';
  url.searchParams.delete('token');

  return NextResponse.redirect(url);
}
