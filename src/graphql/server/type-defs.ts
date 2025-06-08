export const bangersTypeDefs = /* GraphQL */ `
  type Image {
    url: String!
    width: Int!
    height: Int!
  }

  type Track {
    id: ID!
    name: String!
    artist: String!
    spotify_url: String!
    preview_url: String
    image: Image
  }
`

export const typeDefs = /* GraphQL */ `
  type Query {
    bangers: [Track]
  }

  ${bangersTypeDefs}
`
