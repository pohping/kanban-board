import { graphql } from "@workspace/graphql"

export const CREATE_COMMENT = graphql(`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      cardId
    }
  }
`)

export const UPDATE_COMMENT = graphql(`
  mutation updateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      content
      cardId
    }
  }
`)

export const REMOVE_COMMENT = graphql(`
  mutation removeComment($commentId: String!) {
    removeComment(commentId: $commentId) {
      id
      content
      cardId
    }
  }
`)
