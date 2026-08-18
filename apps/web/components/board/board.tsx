import { BoardWithRelations } from "@repo/types"
import { BoardColumn } from "./board-column"

interface BoardProps {
  data: BoardWithRelations
}

export function Board({ data }: BoardProps) {
  return (
    <main className="bg-background">
      <div className="flex gap-3 p-4">
        {data.columns.map((column) => (
          <BoardColumn key={column.id} column={column} />
        ))}
      </div>
    </main>
  )
}
