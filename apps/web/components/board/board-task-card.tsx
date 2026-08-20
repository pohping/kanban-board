import { useSortable } from "@dnd-kit/react/sortable"
import { CardWithRelations } from "@repo/types"
import { TaskCard } from "../task-card/task-card"

interface BoardTaskCardProps {
  columnId: string
  card: CardWithRelations
  index: number
}

export function BoardTaskCard({ card, columnId, index }: BoardTaskCardProps) {
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    group: columnId,
    type: "card",
    accept: "card",
  })

  return (
    <>
      <div ref={ref} className={isDragging ? "opacity-50" : ""}>
        <TaskCard card={card} />
      </div>
      {/* <DragOverlay>
        <TaskCard card={card} />
      </DragOverlay> */}
    </>
  )
}
