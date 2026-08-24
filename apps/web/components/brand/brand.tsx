import { KanbanSquare } from "lucide-react"
import Link from "next/link"

export function Brand() {
  return (
    <Link href="/">
      <div className="flex items-center gap-2">
        <KanbanSquare />
        <h1 className="text-xl font-bold">Kanban</h1>
      </div>
    </Link>
  )
}
