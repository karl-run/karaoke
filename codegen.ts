import { Types } from '@graphql-codegen/plugin-helpers'

import type { CodegenConfig } from '@graphql-codegen/cli'

const eslintIgnorePlugin: Types.OutputConfig = {
  add: {
    content: '/* eslint-disable */',
  },
}

const config: CodegenConfig = {
  schema: './src/graphql/server/type-defs.ts',
  documents: './src/graphql/queries/**.graphql',
  generates: {
    './src/graphql/graphql-operations.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node', eslintIgnorePlugin],
    },
    './src/graphql/server/resolvers.generated.ts': {
      plugins: ['typescript', 'typescript-resolvers', eslintIgnorePlugin],
      config: {
        useIndexSignature: true,
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
