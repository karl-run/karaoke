import { cookies } from 'next/headers';
import { addDays } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  cookies().set('session', '5e59ef16ed0844dfa6eb545e47ffe67f', {
    httpOnly: true,
    expires: addDays(new Date(), 30),
  });

  const url = request.nextUrl.clone();
  url.pathname = '/';

  return NextResponse.redirect(url);
}
