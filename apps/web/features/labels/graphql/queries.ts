import { graphql } from "@workspace/graphql"

export const GET_BOARD_LABELS = graphql(`
  query GetBoardLabel($id: ID!) {
    boardLabels(boardId: $id) {
      id
      name
      color
    }
  }
`)
