import React, { ReactElement } from 'react'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Metadata } from 'next'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SmallPage } from '@/components/layout/Layouts'
import { magicLoginLinkAction } from '@/app/login/_login-actions'

export const metadata: Metadata = {
  title: 'Karaoke Match - Log in',
}

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
      <form action={magicLoginLinkAction} className="flex gap-3">
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
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-red-200 rounded p-2 border border-red-500">
          <p>Local development?</p>
          <Link className="underline" href="/login/magic-link/dev">
            Click here to set local login cookie
          </Link>
        </div>
      )}
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>How does this work?</AlertTitle>
        <AlertDescription>
          This app uses a completely passwordless login system. Enter your email and we will send you a magic link to
          log in.
        </AlertDescription>
      </Alert>
    </SmallPage>
  )
}

export default Page
