import { graphql } from "@workspace/graphql"

export const CREATE_BOARD = graphql(`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      title
      description
    }
  }
`)
