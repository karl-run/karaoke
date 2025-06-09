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
    image: Image!
  }
`

export const otherUserTypeDefs = /* GraphQL */ `
  type OtherUser {
    safeId: String!
    name: String!
    bangers: [Track]
  }
`

export const typeDefs = /* GraphQL */ `
  type Query {
    bangers: [Track]
    otherUser(safeId: String!): OtherUser
  }

  ${bangersTypeDefs}
  ${otherUserTypeDefs}
`
