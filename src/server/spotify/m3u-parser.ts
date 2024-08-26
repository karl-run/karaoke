import * as R from 'remeda';

export type ArtistSongTuple = readonly [artist: string, name: string];

export function parseM3U(m3u: string): ArtistSongTuple[] {
  const lines: string[] = m3u.split('\n');

  return R.pipe(
    lines,
    R.filter(R.isTruthy),
    R.map((it) => it.replace('\r', '')),
    R.filter((it) => it.startsWith('#EXTINF')),
    R.map((it) => it.replace(/#EXTINF:\d+,/, '')),
    R.map((it) => it.split(' - ')),
    R.map(([artist, name]) => [artist, name] as const),
  );
}
