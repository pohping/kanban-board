import { graphql } from "@workspace/graphql"

export const ME = graphql(`
  query Me {
    me {
      id
      username
    }
  }
`)
