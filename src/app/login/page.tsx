import React, { ReactElement } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createMagicLinkForUser } from '@/server/auth/login';
import { SmallPage } from '@/components/layout/Layouts';

function Page(): ReactElement {
  return (
    <SmallPage
      title="Log in"
      className="flex flex-col gap-8"
      back={{
        to: '/',
        text: 'Back to home',
      }}
    >
      <form
        action={async (data) => {
          'use server';

          const email = data.get('email')?.toString();

          if (!email) {
            throw new Error('Email is required');
          }

          await createMagicLinkForUser(email);

          redirect('/login/success');
        }}
        className="flex gap-3"
      >
        <Input name="email" placeholder="Email" required type="email" />
        <Button>Create magic login link</Button>
      </form>
      <div>
        <p>No account yet?</p>
        <Link className="underline" href="/register">
          Register
        </Link>{' '}
        to create a new account
      </div>
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>How does this work?</AlertTitle>
        <AlertDescription>
          This app uses a completely passwordless login system. Enter your email and we will send you a magic link to
          log in.
        </AlertDescription>
      </Alert>
    </SmallPage>
  );
}

export default Page;
