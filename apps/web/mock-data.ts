import type {
  User,
  Board,
  BoardMember,
  Column,
  Card,
  CardAssignee,
  Label,
  CardLabel,
  Comment,
  Attachment,
  BoardWithRelations,
  ColumnWithCards,
  CardWithRelations,
} from "@repo/types"

/* ---------------------------------- Users --------------------------------- */
export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "alice",
    email: "alice@example.com",
    passwordHash: "$2a$10$abcdefghijklmnopqrstuv", // fake hash
    createdAt: "2026-01-10T08:00:00.000Z",
  },
  {
    id: "user-2",
    username: "bob",
    email: "bob@example.com",
    passwordHash: "$2a$10$abcdefghijklmnopqrstuv",
    createdAt: "2026-01-12T09:30:00.000Z",
  },
  {
    id: "user-3",
    username: "carol",
    email: "carol@example.com",
    passwordHash: "$2a$10$abcdefghijklmnopqrstuv",
    createdAt: "2026-02-01T11:15:00.000Z",
  },
  {
    id: "user-4",
    username: "dave",
    email: "dave@example.com",
    passwordHash: "$2a$10$abcdefghijklmnopqrstuv",
    createdAt: "2026-02-15T14:00:00.000Z",
  },
]

/* --------------------------------- Boards --------------------------------- */
export const mockBoards: Board[] = [
  {
    id: "board-1",
    title: "Product Roadmap Q3",
    description: "Main product development board for Q3 2026",
    ownerId: "user-1",
    createdAt: "2026-06-01T10:00:00.000Z",
    updatedAt: "2026-08-15T09:30:00.000Z",
  },
  {
    id: "board-2",
    title: "Marketing Campaign",
    description: "Launch campaign for the new feature",
    ownerId: "user-2",
    createdAt: "2026-07-10T14:20:00.000Z",
    updatedAt: "2026-08-14T16:45:00.000Z",
  },
]

/* ------------------------------ Board Members ----------------------------- */
export const mockBoardMembers: BoardMember[] = [
  {
    boardId: "board-1",
    userId: "user-1",
    role: "owner",
    joinedAt: "2026-06-01T10:00:00.000Z",
  },
  {
    boardId: "board-1",
    userId: "user-2",
    role: "admin",
    joinedAt: "2026-06-02T11:00:00.000Z",
  },
  {
    boardId: "board-1",
    userId: "user-3",
    role: "member",
    joinedAt: "2026-06-05T09:00:00.000Z",
  },
  {
    boardId: "board-1",
    userId: "user-4",
    role: "member",
    joinedAt: "2026-06-08T13:30:00.000Z",
  },
  {
    boardId: "board-2",
    userId: "user-2",
    role: "owner",
    joinedAt: "2026-07-10T14:20:00.000Z",
  },
  {
    boardId: "board-2",
    userId: "user-1",
    role: "member",
    joinedAt: "2026-07-11T10:00:00.000Z",
  },
]

/* --------------------------------- Columns -------------------------------- */
export const mockColumns: Column[] = [
  // Board 1
  {
    id: "col-1",
    boardId: "board-1",
    title: "Backlog",
    position: 0,
    createdAt: "2026-06-01T10:05:00.000Z",
  },
  {
    id: "col-2",
    boardId: "board-1",
    title: "To Do",
    position: 1,
    createdAt: "2026-06-01T10:05:00.000Z",
  },
  {
    id: "col-3",
    boardId: "board-1",
    title: "In Progress",
    position: 2,
    createdAt: "2026-06-01T10:05:00.000Z",
  },
  {
    id: "col-4",
    boardId: "board-1",
    title: "In Review",
    position: 3,
    createdAt: "2026-06-01T10:05:00.000Z",
  },
  {
    id: "col-5",
    boardId: "board-1",
    title: "Done",
    position: 4,
    createdAt: "2026-06-01T10:05:00.000Z",
  },
  // Board 2
  {
    id: "col-6",
    boardId: "board-2",
    title: "Ideas",
    position: 0,
    createdAt: "2026-07-10T14:25:00.000Z",
  },
  {
    id: "col-7",
    boardId: "board-2",
    title: "In Progress",
    position: 1,
    createdAt: "2026-07-10T14:25:00.000Z",
  },
  {
    id: "col-8",
    boardId: "board-2",
    title: "Done",
    position: 2,
    createdAt: "2026-07-10T14:25:00.000Z",
  },
]

/* --------------------------------- Labels --------------------------------- */
export const mockLabels: Label[] = [
  {
    id: "label-1",
    boardId: "board-1",
    name: "Bug",
    color: "#ef4444",
  },
  {
    id: "label-2",
    boardId: "board-1",
    name: "Feature",
    color: "#3b82f6",
  },
  {
    id: "label-3",
    boardId: "board-1",
    name: "Enhancement",
    color: "#8b5cf6",
  },
  {
    id: "label-4",
    boardId: "board-1",
    name: "Urgent",
    color: "#f97316",
  },
  {
    id: "label-5",
    boardId: "board-1",
    name: "Design",
    color: "#ec4899",
  },
  {
    id: "label-6",
    boardId: "board-2",
    name: "Social Media",
    color: "#06b6d4",
  },
  {
    id: "label-7",
    boardId: "board-2",
    name: "Content",
    color: "#10b981",
  },
]

/* ---------------------------------- Cards --------------------------------- */
export const mockCards: Card[] = [
  // Board 1 - Backlog
  {
    id: "card-1",
    columnId: "col-1",
    title: "Research competitor pricing",
    description:
      "Analyze pricing models of the top 5 competitors and prepare a summary.",
    position: 0,
    dueDate: "2026-08-25T00:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-07-15T09:00:00.000Z",
    updatedAt: "2026-08-10T11:20:00.000Z",
  },
  {
    id: "card-2",
    columnId: "col-1",
    title: "Add dark mode support",
    description:
      "Implement system preference detection + manual toggle for dark mode.",
    position: 1,
    dueDate: null,
    createdBy: "user-3",
    createdAt: "2026-07-20T14:30:00.000Z",
    updatedAt: "2026-07-20T14:30:00.000Z",
  },
  // Board 1 - To Do
  {
    id: "card-3",
    columnId: "col-2",
    title: "Fix login redirect bug",
    description:
      "Users are sometimes redirected to the wrong page after login.",
    position: 0,
    dueDate: "2026-08-18T00:00:00.000Z",
    createdBy: "user-2",
    createdAt: "2026-08-01T10:15:00.000Z",
    updatedAt: "2026-08-12T16:00:00.000Z",
  },
  {
    id: "card-4",
    columnId: "col-2",
    title: "Design new onboarding flow",
    description:
      "Create wireframes and high-fidelity designs for the improved onboarding.",
    position: 1,
    dueDate: "2026-08-22T00:00:00.000Z",
    createdBy: "user-3",
    createdAt: "2026-08-05T11:00:00.000Z",
    updatedAt: "2026-08-14T09:45:00.000Z",
  },
  // Board 1 - In Progress
  {
    id: "card-5",
    columnId: "col-3",
    title: "Implement Kanban drag & drop",
    description:
      "Use dnd-kit or similar library to enable smooth card and column reordering.",
    position: 0,
    dueDate: "2026-08-20T00:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-08-08T08:30:00.000Z",
    updatedAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: "card-6",
    columnId: "col-3",
    title: "API rate limiting",
    description: "Add rate limiting middleware to protect public endpoints.",
    position: 1,
    dueDate: "2026-08-19T00:00:00.000Z",
    createdBy: "user-4",
    createdAt: "2026-08-09T13:00:00.000Z",
    updatedAt: "2026-08-14T17:30:00.000Z",
  },
  // Board 1 - In Review
  {
    id: "card-7",
    columnId: "col-4",
    title: "Update documentation",
    description: "Refresh the API docs and add examples for the new endpoints.",
    position: 0,
    dueDate: null,
    createdBy: "user-2",
    createdAt: "2026-08-03T15:00:00.000Z",
    updatedAt: "2026-08-13T12:00:00.000Z",
  },
  // Board 1 - Done
  {
    id: "card-8",
    columnId: "col-5",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for testing and deployment.",
    position: 0,
    dueDate: "2026-07-30T00:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-07-10T09:00:00.000Z",
    updatedAt: "2026-07-28T18:00:00.000Z",
  },
  {
    id: "card-9",
    columnId: "col-5",
    title: "User profile page",
    description: "Build the basic user profile view and edit form.",
    position: 1,
    dueDate: null,
    createdBy: "user-3",
    createdAt: "2026-07-05T11:20:00.000Z",
    updatedAt: "2026-07-25T14:10:00.000Z",
  },
  // Board 2
  {
    id: "card-10",
    columnId: "col-6",
    title: "Brainstorm launch hashtags",
    description: null,
    position: 0,
    dueDate: null,
    createdBy: "user-2",
    createdAt: "2026-07-12T10:00:00.000Z",
    updatedAt: "2026-07-12T10:00:00.000Z",
  },
  {
    id: "card-11",
    columnId: "col-7",
    title: "Write blog post draft",
    description: "First draft of the announcement blog post.",
    position: 0,
    dueDate: "2026-08-17T00:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-08-01T16:00:00.000Z",
    updatedAt: "2026-08-14T11:30:00.000Z",
  },
  {
    id: "card-12",
    columnId: "col-8",
    title: "Create social media assets",
    description: "Design Instagram and Twitter graphics for the launch.",
    position: 0,
    dueDate: null,
    createdBy: "user-2",
    createdAt: "2026-07-20T09:00:00.000Z",
    updatedAt: "2026-08-05T15:00:00.000Z",
  },
]

/* ----------------------------- Card Assignees ----------------------------- */
export const mockCardAssignees: CardAssignee[] = [
  {
    cardId: "card-3",
    userId: "user-2",
    assignedAt: "2026-08-01T10:20:00.000Z",
  },
  {
    cardId: "card-3",
    userId: "user-4",
    assignedAt: "2026-08-02T09:00:00.000Z",
  },
  {
    cardId: "card-4",
    userId: "user-3",
    assignedAt: "2026-08-05T11:10:00.000Z",
  },
  {
    cardId: "card-5",
    userId: "user-1",
    assignedAt: "2026-08-08T08:40:00.000Z",
  },
  {
    cardId: "card-5",
    userId: "user-4",
    assignedAt: "2026-08-09T10:00:00.000Z",
  },
  {
    cardId: "card-6",
    userId: "user-4",
    assignedAt: "2026-08-09T13:10:00.000Z",
  },
  {
    cardId: "card-7",
    userId: "user-2",
    assignedAt: "2026-08-03T15:10:00.000Z",
  },
  {
    cardId: "card-11",
    userId: "user-1",
    assignedAt: "2026-08-01T16:10:00.000Z",
  },
]

/* ------------------------------- Card Labels ------------------------------ */
export const mockCardLabels: CardLabel[] = [
  { cardId: "card-1", labelId: "label-2" }, // Feature
  { cardId: "card-2", labelId: "label-3" }, // Enhancement
  { cardId: "card-3", labelId: "label-1" }, // Bug
  { cardId: "card-3", labelId: "label-4" }, // Urgent
  { cardId: "card-4", labelId: "label-5" }, // Design
  { cardId: "card-5", labelId: "label-2" }, // Feature
  { cardId: "card-6", labelId: "label-2" }, // Feature
  { cardId: "card-7", labelId: "label-3" }, // Enhancement
  { cardId: "card-11", labelId: "label-7" }, // Content
  { cardId: "card-12", labelId: "label-6" }, // Social Media
]

/* -------------------------------- Comments -------------------------------- */
export const mockComments: Comment[] = [
  {
    id: "comment-1",
    cardId: "card-3",
    userId: "user-2",
    content: "I can reproduce this on Chrome. Investigating now.",
    createdAt: "2026-08-02T14:20:00.000Z",
  },
  {
    id: "comment-2",
    cardId: "card-3",
    userId: "user-4",
    content:
      "Found the issue – it's related to the redirect URI configuration.",
    createdAt: "2026-08-03T09:45:00.000Z",
  },
  {
    id: "comment-3",
    cardId: "card-5",
    userId: "user-1",
    content: "Using @dnd-kit for this. Works great so far.",
    createdAt: "2026-08-10T11:00:00.000Z",
  },
  {
    id: "comment-4",
    cardId: "card-5",
    userId: "user-4",
    content: "Need to handle nested scrolling containers carefully.",
    createdAt: "2026-08-12T16:30:00.000Z",
  },
  {
    id: "comment-5",
    cardId: "card-4",
    userId: "user-3",
    content: "First draft of the wireframes is ready for review.",
    createdAt: "2026-08-10T10:15:00.000Z",
  },
  {
    id: "comment-6",
    cardId: "card-11",
    userId: "user-1",
    content: "Draft is about 70% done. Will finish by tomorrow.",
    createdAt: "2026-08-14T11:00:00.000Z",
  },
]

/* ------------------------------- Attachments ------------------------------ */
export const mockAttachments: Attachment[] = [
  {
    id: "att-1",
    cardId: "card-4",
    uploadedBy: "user-3",
    filename: "onboarding-wireframes.fig",
    fileUrl: "https://example.com/files/onboarding-wireframes.fig",
    uploadedAt: "2026-08-10T10:20:00.000Z",
  },
  {
    id: "att-2",
    cardId: "card-5",
    uploadedBy: "user-1",
    filename: "dnd-prototype.mp4",
    fileUrl: "https://example.com/files/dnd-prototype.mp4",
    uploadedAt: "2026-08-11T15:00:00.000Z",
  },
  {
    id: "att-3",
    cardId: "card-12",
    uploadedBy: "user-2",
    filename: "instagram-post-1.png",
    fileUrl: "https://example.com/files/instagram-post-1.png",
    uploadedAt: "2026-08-04T12:30:00.000Z",
  },
]

/* -------------------------------------------------------------------------- */
/*            Helper: Fully populated Board (most useful for UI)              */
/* -------------------------------------------------------------------------- */
export const mockBoardWithRelations: BoardWithRelations = {
  ...mockBoards[0]!,
  owner: mockUsers[0]!,
  members: mockBoardMembers
    .filter((m) => m.boardId === "board-1")
    .map((m) => ({
      ...m,
      user: mockUsers.find((u) => u.id === m.userId)!,
    })),
  labels: mockLabels.filter((l) => l.boardId === "board-1"),
  columns: mockColumns
    .filter((c) => c.boardId === "board-1")
    .sort((a, b) => a.position - b.position)
    .map(
      (column): ColumnWithCards => ({
        ...column,
        cards: mockCards
          .filter((card) => card.columnId === column.id)
          .sort((a, b) => a.position - b.position)
          .map(
            (card): CardWithRelations => ({
              ...card,
              createdByUser: mockUsers.find((u) => u.id === card.createdBy)!,
              assignees: mockCardAssignees
                .filter((a) => a.cardId === card.id)
                .map((a) => ({
                  ...a,
                  user: mockUsers.find((u) => u.id === a.userId)!,
                })),
              labels: mockCardLabels
                .filter((cl) => cl.cardId === card.id)
                .map((cl) => mockLabels.find((l) => l.id === cl.labelId)!),
              comments: mockComments
                .filter((c) => c.cardId === card.id)
                .map((c) => ({
                  ...c,
                  user: mockUsers.find((u) => u.id === c.userId)!,
                })),
              attachments: mockAttachments.filter((a) => a.cardId === card.id),
            })
          ),
      })
    ),
}
