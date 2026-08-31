import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "./apps/api/src/schema.gql",

  documents: "./apps/web/features/**/*.{ts,tsx}",

  generates: {
    "./packages/graphql/generated/": {
      preset: "client",
      config: {
        scalars: {
          DateTime: "string",
        },
      },
    },
  },
}

export default config
