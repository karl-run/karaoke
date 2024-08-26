import React, { ReactElement } from 'react'

import { cn } from '@/lib/utils'

import sheet_png from './sheet.png'

type Props = {
  iconIndex: number
  size?: 'small' | 'normal'
  className?: string
}

const ROW_PADDING = 10.7
const COL_PADDING = 7.8
const ROW_SIZE = 48.2
const COL_SIZE = 48
const ROWS = 6

function GroupAvatar({ iconIndex, className, size = 'normal' }: Props): ReactElement {
  const rowIndex = iconIndex % ROWS
  const colIndex = Math.floor(iconIndex / ROWS)

  return (
    <div
      className={cn(className, 'min-h-12 min-w-12 max-h-12 max-w-12 rounded-xl border')}
      style={{
        backgroundImage: `url(${sheet_png.src})`,
        backgroundPosition: `${-10 - ROW_PADDING * rowIndex - rowIndex * ROW_SIZE}px ${-10 - COL_PADDING * colIndex - colIndex * COL_SIZE}px`,
        backgroundSize: '360px 346px',
        transform: size === 'small' ? 'scale(0.75)' : 'scale(1)',
      }}
      aria-hidden
    />
  )
}

export default GroupAvatar
