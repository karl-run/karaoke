'use client'

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { useCallback, useMemo } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { TrackResult } from '@/server/spotify/types'

import { Label } from '../ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'

type Props = {
  bangs: [string, TrackResult | null][]
}

export function ArtistFilter({ bangs }: Props) {
  const [, setFilter] = useQueryState('filter', parseAsArrayOf(parseAsString))

  const artistsWithCount = useMemo(() => {
    const map = bangs.reduce((acc, [, track]) => {
      if (!track) return acc

      const existingCount = acc.get(track.artist) ?? 0

      return acc.set(track.artist, existingCount + 1)
    }, new Map<string, number>())

    return Array.from(map.entries())
      .filter(([, count]) => count > 1)
      .toSorted(([, aCount], [, bCount]) => bCount - aCount)
  }, [bangs])

  const filterAll = useCallback(() => {
    setFilter(artistsWithCount.map(([name]) => encodeURIComponent(name)))
  }, [artistsWithCount, setFilter])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filter</Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>Filter</SheetHeader>

        <div className="flex flex-row gap-2 my-2">
          <Button variant="outline" onClick={() => setFilter([])}>
            Reset
          </Button>
          <Button variant="outline" onClick={filterAll}>
            Filter all
          </Button>
        </div>

        <div className="flex flex-col gap-1 overflow-scroll">
          {artistsWithCount.map(([name, count]) => (
            <Artist key={name} name={name} count={count} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

const Artist = ({ name, count }: { name: string; count: number }) => {
  const [filter, setFilter] = useQueryState('filter', parseAsArrayOf(parseAsString))

  const uriComponent = encodeURIComponent(name)
  const checked = !filter?.includes(uriComponent)
  const remove = () => setFilter((filter ?? []).filter((f) => f !== uriComponent))
  const add = () => setFilter([...(filter ?? []), uriComponent])

  return (
    <Label className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={checked ? add : remove} />
      {name} ({count})
    </Label>
  )
}
