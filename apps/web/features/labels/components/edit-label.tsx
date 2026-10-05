import { useMutation } from "@apollo/client/react"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import { UPDATE_LABEL } from "../graphql/mutations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateLabelInput, UpdateLabelSchema } from "../schemas/label.schema"
import { GetCardQuery } from "@workspace/graphql"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
] as const

type Color = (typeof COLORS)[number]

interface EditLabelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: GetCardQuery["card"]["labels"][number]
}

export function EditLabel({ label, onOpenChange }: EditLabelProps) {
  const [updateLabel] = useMutation(UPDATE_LABEL)
  const form = useForm({
    resolver: zodResolver(UpdateLabelSchema),
  })

  const [color, setColor] = useState(label.color)

  useEffect(() => {
    form.reset({
      name: label.name,
      color: label.color,
    })
    setColor(label.color)
  }, [label, form])

  function handleChange(nextColor: Color) {
    setColor(nextColor)
  }

  async function handleSubmit(input: UpdateLabelInput) {
    try {
      await updateLabel({
        variables: {
          input: { id: label.id, name: input.name, color },
        },
      })
      toast.success("Label updated.")
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast.error("Update failed.")
    }
  }

  return (
    <Drawer open={true} swipeDirection="right" onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Label</DrawerTitle>
          <DrawerDescription>
            Update the name and color of this label.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <form id="edit-label-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  {...form.register("name")}
                  aria-invalid={!!form.formState.errors.name}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Choose color</FieldLabel>
                <div className="space-y-3">
                  <div className="grid grid-cols-8 gap-2">
                    {COLORS.map((preset) => {
                      const selected = color.toLowerCase() === preset

                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleChange(preset)}
                          className={cn(
                            "flex aspect-square w-full items-center justify-center rounded-md transition hover:scale-105",
                            selected && "ring-2 ring-ring ring-offset-2"
                          )}
                          style={{ backgroundColor: preset }}
                          aria-label={preset}
                        >
                          {selected && (
                            <Check className="size-4 text-white drop-shadow" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </div>
        <DrawerFooter>
          <Button type="submit" form="edit-label-form">
            Save
          </Button>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
