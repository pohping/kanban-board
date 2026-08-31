"use client"

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal } from "lucide-react"
import { CardData } from "../types"
import { EditTaskCard } from "./edit-task-card"
import { DeleteTaskCard } from "./delete-task-card"

interface TaskCardMenuProps {
  card: CardData
}

export function TaskCardMenu({ card }: TaskCardMenuProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="cursor-pointer"
          render={
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setEditOpen(true)
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteOpen(true)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTaskCard
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        card={card}
      />
      <EditTaskCard open={editOpen} onOpenChange={setEditOpen} card={card} />
    </>
  )
}
