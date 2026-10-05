// import { TaskCardDetails } from "@/features/task-cards/components/task-card-details_2"
import { createContext, useContext, useState } from "react"

type BoardContextProps = {
  currentCardId?: string | null
  setCurrentCardId: (id: string) => void
  clearCard: () => void
}

const BoardContext = createContext<BoardContextProps | null>(null)

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [currentCardId, setCurrentCardId] = useState<string>()

  return (
    <BoardContext.Provider
      value={{
        currentCardId,
        setCurrentCardId,
        clearCard: () => setCurrentCardId(undefined),
      }}
    >
      {children}
      {/* show task card details */}
      {/* {currentCardId && <TaskCardDetails id={currentCardId} />} */}
    </BoardContext.Provider>
  )
}

export function useBoard() {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error("useBoard must be used within BoardProvider")
  return ctx
}
