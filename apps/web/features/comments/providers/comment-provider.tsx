import { GetCardQuery } from "@workspace/graphql"
import React, { createContext, useContext, useState } from "react"

type Comment = GetCardQuery["card"]["comments"][number]

interface CommentContextProps {
  editableComment?: Comment
  setEditableComment: (comment?: Comment) => void
}

const CommentContext = createContext<CommentContextProps | null>(null)

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [editableComment, setEditableComment] = useState<Comment>()

  return (
    <CommentContext.Provider value={{ editableComment, setEditableComment }}>
      {children}
    </CommentContext.Provider>
  )
}

export function useComment() {
  const ctx = useContext(CommentContext)

  if (!ctx) {
    throw new Error("useComment must be used within CommentProvider.")
  }

  return ctx
}
