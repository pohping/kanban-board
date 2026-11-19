import { GetBoardQuery } from "@workspace/graphql"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"
import { BoardMemberManager } from "./board-member-manager"

interface BoardMembersProps {
  members: GetBoardQuery["board"]["members"]
  boardId: string
}

export function BoardMembers({ members, boardId }: BoardMembersProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  return (
    <div className="flex">
      {members.map((member) => (
        <Avatar key={member.user.id}>
          <AvatarFallback>
            {member.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      <Button onClick={() => setShowInviteDialog(true)}>Invite</Button>
      <BoardMemberManager
        boardId={boardId}
        boardMembers={members}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
    </div>
  )
}
