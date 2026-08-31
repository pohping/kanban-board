/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      user {\n        id\n        username\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      username\n    }\n  }\n": typeof types.MeDocument,
    "\n  query MyBoards {\n    myBoards {\n      id\n      title\n      description\n      columns {\n        cards {\n          id\n        }\n      }\n    }\n  }\n": typeof types.MyBoardsDocument,
    "\n  query GetBoard($id: ID!) {\n    board(id: $id) {\n      id\n      title\n      description\n      labels {\n        id\n        name\n        color\n      }\n      members {\n        user {\n          id\n          username\n        }\n      }\n      columns {\n        id\n        title\n        position\n        cards {\n          id\n          title\n          description\n          position\n          dueDate\n          commentCount\n          attachmentCount\n          assignees {\n            user {\n              id\n              username\n            }\n          }\n          labels {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetBoardDocument,
    "\n  mutation CreateCard($input: CreateCardInput!) {\n    createCard(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateCardDocument,
    "\n  mutation UpdateCard($input: UpdateCardInput!) {\n    updateCard(input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateCardDocument,
    "\n  mutation MoveCard($input: MoveCardInput!) {\n    moveCard(input: $input) {\n      id\n      position\n      columnId\n    }\n  }\n": typeof types.MoveCardDocument,
    "\n  mutation DeleteCard($id: ID!) {\n    deleteCard(id: $id)\n  }\n": typeof types.DeleteCardDocument,
    "\n  mutation AssignCard($input: AssignCardInput!) {\n    assignCard(input: $input) {\n      cardId\n      userId\n    }\n  }\n": typeof types.AssignCardDocument,
    "\n  mutation UnassignCard($input: AssignCardInput!) {\n    unassignCard(input: $input)\n  }\n": typeof types.UnassignCardDocument,
    "\n  mutation AddCardLabel($input: CardLabelInput!) {\n    addCardLabel(input: $input)\n  }\n": typeof types.AddCardLabelDocument,
    "\n  mutation RemoveCardLabel($input: CardLabelInput!) {\n    removeCardLabel(input: $input)\n  }\n": typeof types.RemoveCardLabelDocument,
    "\n  query GetCardsByColumn($columnId: ID!) {\n    cardsByColumn(columnId: $columnId) {\n      id\n      title\n      description\n    }\n  }\n": typeof types.GetCardsByColumnDocument,
};
const documents: Documents = {
    "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      user {\n        id\n        username\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      username\n    }\n  }\n": types.MeDocument,
    "\n  query MyBoards {\n    myBoards {\n      id\n      title\n      description\n      columns {\n        cards {\n          id\n        }\n      }\n    }\n  }\n": types.MyBoardsDocument,
    "\n  query GetBoard($id: ID!) {\n    board(id: $id) {\n      id\n      title\n      description\n      labels {\n        id\n        name\n        color\n      }\n      members {\n        user {\n          id\n          username\n        }\n      }\n      columns {\n        id\n        title\n        position\n        cards {\n          id\n          title\n          description\n          position\n          dueDate\n          commentCount\n          attachmentCount\n          assignees {\n            user {\n              id\n              username\n            }\n          }\n          labels {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n": types.GetBoardDocument,
    "\n  mutation CreateCard($input: CreateCardInput!) {\n    createCard(input: $input) {\n      id\n    }\n  }\n": types.CreateCardDocument,
    "\n  mutation UpdateCard($input: UpdateCardInput!) {\n    updateCard(input: $input) {\n      id\n    }\n  }\n": types.UpdateCardDocument,
    "\n  mutation MoveCard($input: MoveCardInput!) {\n    moveCard(input: $input) {\n      id\n      position\n      columnId\n    }\n  }\n": types.MoveCardDocument,
    "\n  mutation DeleteCard($id: ID!) {\n    deleteCard(id: $id)\n  }\n": types.DeleteCardDocument,
    "\n  mutation AssignCard($input: AssignCardInput!) {\n    assignCard(input: $input) {\n      cardId\n      userId\n    }\n  }\n": types.AssignCardDocument,
    "\n  mutation UnassignCard($input: AssignCardInput!) {\n    unassignCard(input: $input)\n  }\n": types.UnassignCardDocument,
    "\n  mutation AddCardLabel($input: CardLabelInput!) {\n    addCardLabel(input: $input)\n  }\n": types.AddCardLabelDocument,
    "\n  mutation RemoveCardLabel($input: CardLabelInput!) {\n    removeCardLabel(input: $input)\n  }\n": types.RemoveCardLabelDocument,
    "\n  query GetCardsByColumn($columnId: ID!) {\n    cardsByColumn(columnId: $columnId) {\n      id\n      title\n      description\n    }\n  }\n": types.GetCardsByColumnDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      user {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      user {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      username\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyBoards {\n    myBoards {\n      id\n      title\n      description\n      columns {\n        cards {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyBoards {\n    myBoards {\n      id\n      title\n      description\n      columns {\n        cards {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBoard($id: ID!) {\n    board(id: $id) {\n      id\n      title\n      description\n      labels {\n        id\n        name\n        color\n      }\n      members {\n        user {\n          id\n          username\n        }\n      }\n      columns {\n        id\n        title\n        position\n        cards {\n          id\n          title\n          description\n          position\n          dueDate\n          commentCount\n          attachmentCount\n          assignees {\n            user {\n              id\n              username\n            }\n          }\n          labels {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBoard($id: ID!) {\n    board(id: $id) {\n      id\n      title\n      description\n      labels {\n        id\n        name\n        color\n      }\n      members {\n        user {\n          id\n          username\n        }\n      }\n      columns {\n        id\n        title\n        position\n        cards {\n          id\n          title\n          description\n          position\n          dueDate\n          commentCount\n          attachmentCount\n          assignees {\n            user {\n              id\n              username\n            }\n          }\n          labels {\n            id\n            name\n            color\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCard($input: CreateCardInput!) {\n    createCard(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCard($input: CreateCardInput!) {\n    createCard(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCard($input: UpdateCardInput!) {\n    updateCard(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCard($input: UpdateCardInput!) {\n    updateCard(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MoveCard($input: MoveCardInput!) {\n    moveCard(input: $input) {\n      id\n      position\n      columnId\n    }\n  }\n"): (typeof documents)["\n  mutation MoveCard($input: MoveCardInput!) {\n    moveCard(input: $input) {\n      id\n      position\n      columnId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCard($id: ID!) {\n    deleteCard(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteCard($id: ID!) {\n    deleteCard(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AssignCard($input: AssignCardInput!) {\n    assignCard(input: $input) {\n      cardId\n      userId\n    }\n  }\n"): (typeof documents)["\n  mutation AssignCard($input: AssignCardInput!) {\n    assignCard(input: $input) {\n      cardId\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnassignCard($input: AssignCardInput!) {\n    unassignCard(input: $input)\n  }\n"): (typeof documents)["\n  mutation UnassignCard($input: AssignCardInput!) {\n    unassignCard(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddCardLabel($input: CardLabelInput!) {\n    addCardLabel(input: $input)\n  }\n"): (typeof documents)["\n  mutation AddCardLabel($input: CardLabelInput!) {\n    addCardLabel(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCardLabel($input: CardLabelInput!) {\n    removeCardLabel(input: $input)\n  }\n"): (typeof documents)["\n  mutation RemoveCardLabel($input: CardLabelInput!) {\n    removeCardLabel(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCardsByColumn($columnId: ID!) {\n    cardsByColumn(columnId: $columnId) {\n      id\n      title\n      description\n    }\n  }\n"): (typeof documents)["\n  query GetCardsByColumn($columnId: ID!) {\n    cardsByColumn(columnId: $columnId) {\n      id\n      title\n      description\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;