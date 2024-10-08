import React, { ReactElement } from 'react'
import { redirect } from 'next/navigation'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Metadata } from 'next'

import { signup } from 'server/user/user-login-service'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SmallPage } from '@/components/layout/Layouts'

export const metadata: Metadata = {
  title: 'Karaoke Match - Register',
}

function Page(): ReactElement {
  return (
    <SmallPage
      title="Create new account"
      className="flex flex-col gap-8"
      back={{
        to: '/',
        text: 'Back to home',
      }}
    >
      <form
        action={async (data) => {
          'use server'

          const email = data.get('email')?.toString()
          const name = data.get('name')?.toString()

          if (!email || !name) {
            throw new Error('Email and name is required')
          }

          await signup(email, name)

          redirect('/login/success?new=true')
        }}
        className="flex flex-col xs:flex-row gap-3"
      >
        <Input name="email" placeholder="Email" required type="email" />
        <Input name="name" placeholder="Display name" required type="text" maxLength={16} />
        <Button>Create</Button>
      </form>
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>After registration</AlertTitle>
        <AlertDescription>Once you register you will receive a magic link to verify and log in.</AlertDescription>
      </Alert>
    </SmallPage>
  )
}

export default Page
