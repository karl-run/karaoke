'use client'

import { useQueryState } from 'nuqs'

import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function SortBy() {
  const [search, setSearch] = useQueryState('sort')

  return (
    <Label className="flex flex-col gap-2">
      Sort by
      <ToggleGroup
        type="single"
        value={search ?? 'artist'}
        defaultValue={'artist'}
        onValueChange={setSearch}
        className="whitespace-nowrap">
        <ToggleGroupItem value={'artist'}>Artist</ToggleGroupItem>
        <ToggleGroupItem value={'song-name'}>Song name</ToggleGroupItem>
        <ToggleGroupItem value={'date-added'}>Date added</ToggleGroupItem>
      </ToggleGroup>
    </Label>
  )
}
