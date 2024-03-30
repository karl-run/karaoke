import { NextRequest, NextResponse } from 'next/server';
import { clearUserSession, getActiveSession } from '@/db/sessions';
import { cookies } from 'next/headers';
import { addDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const session = await getActiveSession(request.cookies.get('session')?.value ?? null);

  cookies().delete({
    name: 'session',
    httpOnly: true,
  });

  if (session == null || session?.id == null) {
    return backToRoot(request);
  }

  await clearUserSession(session.id);

  return backToRoot(request);
}

function backToRoot(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/';

  return NextResponse.redirect(url);
}
