import React, { ReactElement } from 'react'

import { getTrack } from 'server/spotify/track'

import Track, { TrackProps } from '@/components/track/Track'

/**
 * @Deprecated
 */
export async function LazyTrack({
  trackId,
  action,
}: { trackId: string } & Pick<TrackProps, 'action'>): Promise<ReactElement> {
  const track = await getTrack(trackId, true)

  return <Track track={track} action={action} />
}
