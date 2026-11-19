import { graphql } from "@workspace/graphql"

export const CREATE_BOARD = graphql(`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      title
      description
    }
  }
`)

export const ADD_BOARD_MEMBER = graphql(`
  mutation AddBoardMember($boardId: ID!, $userId: ID!) {
    addBoardMember(boardId: $boardId, userId: $userId) {
      user {
        id
        name
        email
      }
      role
    }
  }
`)
