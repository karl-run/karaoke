import { mockSearch, mockTrackLookup } from 'server/spotify/mockify/search'

export async function mockify(pathOrUrl: string): Promise<any> {
  const [path, query] = pathOrUrl.split('?')
  const params = new URLSearchParams(query)

  if (path === '/v1/search') {
    return mockSearch(params)
  } else if (path.startsWith('/v1/tracks')) {
    return mockTrackLookup(path.replace('/v1/tracks/', ''))
  }

  throw new Error(`Illegal state, ${path} not implemented in mocks`)
}
