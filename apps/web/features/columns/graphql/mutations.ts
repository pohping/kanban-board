import { graphql } from "@workspace/graphql"

export const CREATE_COLUMN = graphql(`
  mutation CreateColumn($input: CreateColumnInput!) {
    createColumn(input: $input) {
      title
    }
  }
`)

export const MOVE_COLUMN = graphql(`
  mutation MoveColumn($input: MoveColumnInput!) {
    moveColumn(input: $input) {
      id
      position
    }
  }
`)
