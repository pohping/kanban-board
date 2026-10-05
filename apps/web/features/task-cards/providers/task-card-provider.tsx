import { createContext, useContext, useState } from "react"
import { TaskCardDetails } from "../components/task-card-details/task-card-details"

type View = "details" | "list-label"

interface TaskCardContextProps {
  currentId: string | null
  setCurrentId: (id: string | null) => void
  clearCurrentId: () => void

  view: View
  setView: (view: View) => void
}

const TaskCardContext = createContext<TaskCardContextProps | null>(null)

export function TaskCardProvider({ children }: { children: React.ReactNode }) {
  const [currentId, setCurrentId] = useState<string | null>(null)

  const [view, setView] = useState<View>("details")

  function clearCurrentId() {
    setCurrentId(null)
    setView("details")
  }

  return (
    <TaskCardContext.Provider
      value={{
        currentId,
        setCurrentId,
        clearCurrentId,
        view,
        setView,
      }}
    >
      {children}
      {currentId && <TaskCardDetails />}
    </TaskCardContext.Provider>
  )
}

export function useTaskCard() {
  const ctx = useContext(TaskCardContext)
  if (!ctx) throw new Error("useTaskCard must be used within TaskCardProvider")
  return ctx
}
