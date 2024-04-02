import { TrackResult } from 'server/spotify/types';

export async function getGroupMemberById(
  userId: string,
  lookerUserId: string,
): Promise<{
  displayName: string;
  tracks: TrackResult[];
}> {
  return {
    displayName: 'TEST',
    tracks: [],
  };
}
