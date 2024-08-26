'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getTrack } from 'server/spotify/track'
import { dismissSuggestion } from 'server/bangers/suggestions-service'
import { trackToNormalizedId } from 'server/bangers/normalization'

import { getUser } from '@/server/user/user-service'
import { addBanger, removeBanger } from '@/server/bangers/bangers-db'

export async function addBangerAction(
  trackId: string,
  revalidate: boolean = true,
): Promise<{ error: 'not-logged-in' } | { ok: true }> {
  const user = await getUser()

  if (!user) {
    return {
      error: 'not-logged-in',
    }
  }

  const track = await getTrack(trackId, true)
  await addBanger(user.userId, track)

  if (revalidate) {
    revalidateTag('bangers')
  }

  return {
    ok: true,
  }
}

export async function dismissTrackAction(trackId: string): Promise<{ error: 'not-logged-in' } | { ok: true }> {
  const user = await getUser()

  if (!user) {
    return {
      error: 'not-logged-in',
    }
  }

  const track = await getTrack(trackId, true)
  await dismissSuggestion(user.userId, trackToNormalizedId(track))

  return {
    ok: true,
  }
}

export async function removeBangerAction(trackId: string) {
  const user = await getUser()

  if (!user) {
    throw new Error('User not logged in')
    // TODO redirect?
  }

  await removeBanger(user.userId, trackId)

  revalidatePath('/bangers')
}
