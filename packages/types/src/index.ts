/* -------------------------------------------------------------------------- */
/*                                 Base Types                                 */
/* -------------------------------------------------------------------------- */
export type UUID = string
export type ISODateString = string
export type BoardRole = "owner" | "admin" | "member"

/* -------------------------------------------------------------------------- */
/*                                Core Entities                               */
/* -------------------------------------------------------------------------- */
export interface User {
  id: UUID
  username: string
  email: string
  passwordHash: string
  createdAt: ISODateString
}

export interface Board {
  id: UUID
  title: string
  description: string | null
  ownerId: UUID
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface BoardMember {
  boardId: UUID
  userId: UUID
  role: BoardRole
  joinedAt: ISODateString
}

export interface Column {
  id: UUID
  boardId: UUID
  title: string
  position: number
  createdAt: ISODateString
}

export interface Card {
  id: UUID
  columnId: UUID
  title: string
  description: string | null
  position: number
  dueDate: ISODateString | null
  createdBy: UUID
  createdAt: ISODateString
  updatedAt: ISODateString
}

export interface CardAssignee {
  cardId: UUID
  userId: UUID
  assignedAt: ISODateString
}

export interface Label {
  id: UUID
  boardId: UUID
  name: string
  color: string // e.g. "#ef4444"
}

export interface CardLabel {
  cardId: UUID
  labelId: UUID
}

export interface Comment {
  id: UUID
  cardId: UUID
  userId: UUID
  content: string
  createdAt: ISODateString
}

export interface Attachment {
  id: UUID
  cardId: UUID
  uploadedBy: UUID
  filename: string
  fileUrl: string
  uploadedAt: ISODateString
}

/* -------------------------------------------------------------------------- */
/*                           Useful Composite Types                           */
/* -------------------------------------------------------------------------- */
export interface BoardWithRelations extends Board {
  owner: User
  members: (BoardMember & { user: User })[]
  columns: ColumnWithCards[]
  labels: Label[]
}

export interface ColumnWithCards extends Column {
  cards: CardWithRelations[]
}

export interface CardWithRelations extends Card {
  assignees: (CardAssignee & { user: User })[]
  labels: Label[]
  comments: (Comment & { user: User })[]
  attachments: Attachment[]
  createdByUser: User
}
