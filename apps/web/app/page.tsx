import { Board } from "@/components/board/board"
import { mockBoardWithRelations } from "@/mock-data"

export default function Page() {
  return <Board data={mockBoardWithRelations} />
}
