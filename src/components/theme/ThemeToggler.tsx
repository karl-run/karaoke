'use client'

import React, { ReactElement } from 'react'
import { useTheme } from 'next-themes'

import { DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'

function ThemeToggler(): ReactElement {
  const { setTheme, systemTheme, theme } = useTheme()

  return (
    <>
      <DropdownMenuLabel>Theme ({theme})</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={() => {
          setTheme('system')
        }}
      >
        System ({systemTheme})
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setTheme('dark')
        }}
      >
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setTheme('light')
        }}
      >
        Light
      </DropdownMenuItem>
    </>
  )
}

export default ThemeToggler
