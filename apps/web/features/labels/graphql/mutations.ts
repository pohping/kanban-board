import { graphql } from "@workspace/graphql"

export const UPDATE_LABEL = graphql(`
  mutation UpdateLabel($input: UpdateLabelInput!) {
    updateLabel(input: $input) {
      id
      name
      color
    }
  }
`)
