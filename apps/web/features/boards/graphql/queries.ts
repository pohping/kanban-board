import { graphql } from "@workspace/graphql"

export const MY_BOARDS = graphql(`
  query MyBoards {
    myBoards {
      id
      title
      description
      columns {
        cards {
          id
        }
      }
    }
  }
`)

export const GET_BOARD = graphql(`
  query GetBoard($id: ID!) {
    board(id: $id) {
      id
      title
      description
      labels {
        id
        name
        color
      }
      members {
        user {
          id
          username
        }
      }
      columns {
        id
        title
        position
        cards {
          id
          title
          description
          position
          dueDate
          commentCount
          attachmentCount
          assignees {
            user {
              id
              username
            }
          }
          labels {
            id
            name
            color
          }
        }
      }
    }
  }
`)
