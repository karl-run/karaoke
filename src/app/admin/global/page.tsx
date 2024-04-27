import * as R from 'remeda'
import React, { ReactElement } from 'react'
import { eq } from 'drizzle-orm'

import { db, globalBangers, normalizedSongCache } from 'server/db'

import { getVerifiedAdmin } from '@/app/admin/_admin-utils'
import Track from '@/components/track/Track'
import { TrackGrid } from '@/components/track/TrackGrid'
import { FullPage, FullPageDescription, FullPageDetails } from '@/components/layout/Layouts'

async function Page(): Promise<ReactElement> {
  await getVerifiedAdmin()

  const gwobby = await db
    .select()
    .from(globalBangers)
    .leftJoin(normalizedSongCache, eq(globalBangers.songKey, normalizedSongCache.songKey))

  const grouped = R.groupBy(gwobby, (it) => it.global_bangers.region)

  return (
    <FullPage title="Global bangers admin page">
      <FullPageDescription>There are {gwobby.length} global bangers in the database.</FullPageDescription>

      {R.entries(grouped).map(([region, songs]) => (
        <details key={region} open>
          <summary>
            <FullPageDetails className="mt-4">
              <div className="uppercase font-bold">{region}</div>
              <div>{songs.length} songs</div>
            </FullPageDetails>
          </summary>
          <TrackGrid>
            {R.sortBy(songs, [(it) => it.global_bangers.region, 'desc']).map((it) => {
              if (!it.normalized_song_cache?.data) {
                return <div key={it.global_bangers.songKey}>Missing data for {it.global_bangers.songKey}</div>
              }

              return (
                <div key={it.global_bangers.songKey}>
                  <div className="text-xs">{it.global_bangers.region}</div>
                  <Track track={it.normalized_song_cache.data} action="none" />
                </div>
              )
            })}
          </TrackGrid>
        </details>
      ))}
    </FullPage>
  )
}

export default Page
