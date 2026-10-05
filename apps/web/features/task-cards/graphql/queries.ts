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

export const GET_CARD = graphql(`
  query GetCard($id: ID!) {
    card(id: $id) {
      id
      title
      description
      dueDate
      assignees {
        user {
          id
          name
        }
      }
      labels {
        id
        name
        color
      }
      comments {
        id
        content
        user {
          id
          name
        }
        createdAt
      }
      attachments {
        id
        filename
        fileUrl
        uploadedAt
      }
    }
  }
`)
