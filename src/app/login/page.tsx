import React, { ReactElement } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { redirect } from 'next/navigation';
import { createMagicLinkForUser } from '@/auth/login';
import Link from 'next/link';

function Page(): ReactElement {
  return (
    <div className="container">
      <div className="p-8 max-w-prose flex flex-col gap-8">
        <h1 className="text-xl">Log in</h1>
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
      </div>
    </div>
  );
}

export default Page;
