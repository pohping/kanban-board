import { GET_BOARD } from "@/features/boards/graphql/queries"
import { useMutation, useQuery } from "@apollo/client/react/compiled"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { useParams } from "next/dist/client/components/navigation"
import { GetCardQuery } from "../../../../../../packages/graphql/generated/graphql"
import { ASSIGN_CARD, UNASSIGN_CARD } from "../../graphql/mutations"
import { Label } from "@workspace/ui/components/label"
import { DialogClose } from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"

interface TaskCardAssigneeListProps {
  card: GetCardQuery["card"]
  onClose: () => void
}

export function TaskCardAssigneeList({
  card,
  onClose,
}: TaskCardAssigneeListProps) {
  const { id: boardId } = useParams<{ id: string }>()
  const boardData = useQuery(GET_BOARD, {
    variables: { id: boardId },
  })

  const refetchOptions = {
    refetchQueries: [{ query: GET_BOARD, variables: { id: boardId } }],
    awaitRefetchQueries: true,
  }
  const [assignCard, { loading: assignLoading }] = useMutation(
    ASSIGN_CARD,
    refetchOptions
  )
  const [unassignCard, { loading: unassignLoading }] = useMutation(
    UNASSIGN_CARD,
    refetchOptions
  )

  const members = boardData?.data?.board?.members ?? []
  const assignedUsersIds = new Set(card.assignees?.map((a) => a.user.id) ?? [])

  async function toggleAssignee(userId: string, shouldAssign: boolean) {
    try {
      if (shouldAssign) {
        await assignCard({ variables: { input: { cardId: card.id, userId } } })
      } else {
        await unassignCard({
          variables: { input: { cardId: card.id, userId } },
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isLoading = assignLoading || unassignLoading

  return (
    <Drawer open={true} swipeDirection="right" onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Assignees</DrawerTitle>
          <DrawerDescription>Manage assignees for this task</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <FieldGroup className="mt-2 space-y-1">
            {members.map((member) => (
              <Field orientation="horizontal" key={member.user.id}>
                <Checkbox
                  id={`member-${member.user.id}`}
                  checked={assignedUsersIds.has(member.user.id)}
                  onCheckedChange={(value) =>
                    toggleAssignee(member.user.id, !!value)
                  }
                  disabled={isLoading}
                />
                <Label htmlFor={`member-${member.user.id}`} className="text-sm">
                  {member.user.name}
                </Label>
              </Field>
            ))}
          </FieldGroup>
        </div>
        <DrawerFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
