import { Label } from "@repo/types"
import { Badge } from "@workspace/ui/components/badge"

interface TaskCardLabelsProps {
  labels: Label[]
}

export function TaskCardLabels({ labels }: TaskCardLabelsProps) {
  if (labels.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <Badge key={label.id} variant="secondary" className="gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: label.color }}
          />
          {label.name}
        </Badge>
      ))}
    </div>
  )
}
