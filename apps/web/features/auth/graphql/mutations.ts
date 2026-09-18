import { graphql } from "@workspace/graphql"

export const LOGIN = graphql(`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      user {
        id
        email
      }
    }
  }
`)

export const LOGOUT = graphql(`
  mutation Logout {
    logout
  }
`)
