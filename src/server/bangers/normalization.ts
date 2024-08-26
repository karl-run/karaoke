import * as R from 'remeda'

const replaceList: (string | RegExp)[] = [
  /Live in .*/gi,
  /Live at .*/gi,
  /Live from .*/gi,
  /Theme From .*/gi,
  /From "Grease .*/gi,
  /Extended Version/gi,
  /Acoustic Version/gi,
  /From.*?Soundtrack/gi,
  /Original Version/gi,
  /Single Version/gi,
  /Single Remix/gi,
  /Radio Edit/gi,
  /Piano Version/gi,
  /Spanish Version/gi,
  /Karaoke Edition/gi,
  /Remastered \d{4}/gi,
  /\d{4} remaster/gi,
  /\(Taylor's Version\)/gi,
  /\(Taylor’s Version\)/gi,
  /- Remastered/gi,
  /- Acoustic/gi,
  /- Commentary/gi,
  /- Radio/gi,
  /- Pop Version/gi,
  /- Mono Single/gi,
  /- International Version/gi,
  /(Live)/gi,
  /- Live/gi,
  /\s\s+/gi,
  /-Version/gi,
]

const clean = new RegExp('[^a-zA-Z0-9]', 'g')

export function trackToNormalizedId(track: { artist: string; name: string }): string {
  const baseKey = `${track.artist}-${track.name}`
  const replaced = R.pipe(
    replaceList,
    R.reduce((acc, it) => acc.replace(it, ''), baseKey),
  )

  return replaced.replace(clean, '').toLocaleLowerCase()
}
