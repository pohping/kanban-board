import { graphql } from "@workspace/graphql"

export const GET_USERS = graphql(`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`)
