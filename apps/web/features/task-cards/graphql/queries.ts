import { graphql } from "@workspace/graphql"

export const GET_CARDS_BY_COLUMN = graphql(`
  query GetCardsByColumn($columnId: ID!) {
    cardsByColumn(columnId: $columnId) {
      id
      title
      description
    }
  }
`)
