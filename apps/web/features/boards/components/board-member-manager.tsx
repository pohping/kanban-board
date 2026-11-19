import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@workspace/ui/components/combobox"
import { GetBoardQuery } from "../../../../../packages/graphql/generated/graphql"
import { useMutation, useQuery } from "@apollo/client/react"
import { GET_USERS } from "@/features/users/graphql/queries"
import { toast } from "sonner"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { InfoIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { ADD_BOARD_MEMBER } from "../graphql/mutations"
import { GET_BOARD } from "../graphql/queries"

interface BoardMemberManagerProps {
  boardMembers: GetBoardQuery["board"]["members"]
  open: boolean
  onOpenChange: (open: boolean) => void
  boardId: string
}

export function BoardMemberManager({
  boardMembers,
  open,
  onOpenChange,
  boardId,
}: BoardMemberManagerProps) {
  const { data: usersData } = useQuery(GET_USERS)
  const [addBoardMember] = useMutation(ADD_BOARD_MEMBER, {
    refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
  })

  const [showUserExistsMessage, setShowUserExistsMessage] = useState(false)

  function handleValueChange(id: string | null) {
    if (boardMembers.some((member) => member.user.id === id)) {
      setShowUserExistsMessage(true)
    } else if (id) {
      addBoardMember({ variables: { boardId, userId: id } })
      setShowUserExistsMessage(false)
    }
    showUserExistsMessage && setShowUserExistsMessage(false)
  }

  function handleOpenChange(open: boolean) {
    setShowUserExistsMessage(false)
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-fit max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>
        {showUserExistsMessage && (
          <Alert>
            <InfoIcon />
            <AlertTitle>User already exists</AlertTitle>
            <AlertDescription>
              This user is already a member of the board.
            </AlertDescription>
          </Alert>
        )}
        <Combobox
          items={usersData?.users ?? []}
          // value={boardMemberIds}
          // multiple={true}
          // itemToStringValue={(item) => "bla bla bla"}
          onValueChange={handleValueChange}
        >
          <ComboboxInput placeholder="Search by name or email" value="" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => {
                const isAlreadyMember = boardMembers.some(
                  (member) => member.user.id === item.id
                )

                return (
                  <ComboboxItem key={item.id} value={item.id}>
                    <span className={cn("truncate")}>{item.name}</span>
                  </ComboboxItem>
                )
              }}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <div className="mt-4 text-lg font-medium">
          Board member ({boardMembers.length})
        </div>
        <div className="space-y-2">
          {boardMembers.map((member) => (
            <Item
              key={member.user.id}
              variant="muted"
              className="cursor-default"
            >
              <ItemMedia>
                <Avatar>
                  <AvatarFallback>
                    {member.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="min-w-0 px-4">
                <ItemTitle>{member.user.name}</ItemTitle>
                <ItemDescription>{member.user.email}</ItemDescription>
              </ItemContent>
              <ItemActions>{member.role}</ItemActions>
            </Item>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
