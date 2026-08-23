import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "./apps/api/src/schema.gql",

  documents: "./packages/graphql/documents/**/*.graphql",

  generates: {
    "./packages/graphql/generated/": {
      preset: "client",
    },
  },
}

export default config
