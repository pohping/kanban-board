import { graphql } from "@workspace/graphql"

export const CREATE_CARD = graphql(`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
    }
  }
`)

export const UPDATE_CARD = graphql(`
  mutation UpdateCard($input: UpdateCardInput!) {
    updateCard(input: $input) {
      id
    }
  }
`)

export const MOVE_CARD = graphql(`
  mutation MoveCard($input: MoveCardInput!) {
    moveCard(input: $input) {
      id
      position
      columnId
    }
  }
`)

export const DELETE_CARD = graphql(`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`)

export const ASSIGN_CARD = graphql(`
  mutation AssignCard($input: AssignCardInput!) {
    assignCard(input: $input) {
      cardId
      userId
    }
  }
`)

export const UNASSIGN_CARD = graphql(`
  mutation UnassignCard($input: AssignCardInput!) {
    unassignCard(input: $input)
  }
`)

export const ADD_CARD_LABEL = graphql(`
  mutation AddCardLabel($input: CardLabelInput!) {
    addCardLabel(input: $input)
  }
`)

export const REMOVE_CARD_LABEL = graphql(`
  mutation RemoveCardLabel($input: CardLabelInput!) {
    removeCardLabel(input: $input)
  }
`)
