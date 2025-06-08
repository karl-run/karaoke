/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type Image = {
  __typename?: 'Image'
  height: Scalars['Int']['output']
  url: Scalars['String']['output']
  width: Scalars['Int']['output']
}

export type Query = {
  __typename?: 'Query'
  bangers?: Maybe<Array<Maybe<Track>>>
}

export type Track = {
  __typename?: 'Track'
  artist: Scalars['String']['output']
  id: Scalars['ID']['output']
  image?: Maybe<Image>
  name: Scalars['String']['output']
  preview_url?: Maybe<Scalars['String']['output']>
  spotify_url: Scalars['String']['output']
}

export type AllUserBangersQueryVariables = Exact<{ [key: string]: never }>

export type AllUserBangersQuery = {
  __typename?: 'Query'
  bangers?: Array<{
    __typename?: 'Track'
    id: string
    name: string
    artist: string
    preview_url?: string | null
    spotify_url: string
    image?: { __typename?: 'Image'; url: string; height: number; width: number } | null
  } | null> | null
}

export const AllUserBangersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AllUserBangers' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'bangers' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'artist' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preview_url' } },
                { kind: 'Field', name: { kind: 'Name', value: 'spotify_url' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'image' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AllUserBangersQuery, AllUserBangersQueryVariables>
