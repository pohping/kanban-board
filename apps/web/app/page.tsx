import { Board } from "@/components/board/board"
import { Navbar } from "@/components/navbar/navbar"
import { mockBoardWithRelations } from "@/mock-data"

export default function Page() {
  return (
    <div>
      <Navbar />

      <Board data={mockBoardWithRelations} />
    </div>
  )
}
