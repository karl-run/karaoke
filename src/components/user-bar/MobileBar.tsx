'use client'

import React, { ReactElement } from 'react'
import { useSearchParams, useSelectedLayoutSegment } from 'next/navigation'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import styles from './MobileBar.module.css'

function MobileBar(): ReactElement {
  const query = useSearchParams().get('q')
  const route = useSelectedLayoutSegment()

  return (
    <nav className={cn(styles.nav)}>
      <Button
        variant="ghost"
        className={cn('h-full', {
          'bg-accent underline': route === 'bangers',
        })}
        asChild
      >
        <Link href="/bangers">Bangers</Link>
      </Button>
      <div className="flex items-center justify-center relative">
        <Button
          variant="outline"
          className={cn('rounded-full w-20 h-20 absolute -top-8', {
            'bg-accent underline': typeof query === 'string',
          })}
          asChild
        >
          <Link
            href="/?focus=true&q="
            onClick={() => {
              document.getElementById('primary-search')?.focus()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setTimeout(() => {
                  document.getElementById('primary-search')?.focus()
                }, 100)
              }
            }}
          >
            <MagnifyingGlassIcon className="h-8 w-8" />
          </Link>
        </Button>
      </div>
      <Button
        variant="ghost"
        className={cn('h-full', {
          'bg-accent underline': route === 'groups',
        })}
        asChild
      >
        <Link href="/groups">Groups</Link>
      </Button>
    </nav>
  )
}

export default MobileBar
