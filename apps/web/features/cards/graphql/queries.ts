import { gql } from "@apollo/client"

export const GET_CARDS_BY_COLUMN = gql`
  query GetCardsByColumn($columnId: ID!) {
    cardsByColumn(columnId: $columnId) {
      id
      title
      description
    }
  }
`
