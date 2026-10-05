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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GetCardQuery } from "@workspace/graphql"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import { UPDATE_LABEL } from "@/features/labels/graphql/mutations"
import {
  type UpdateLabelInput,
  updateLabelSchema,
} from "@/features/labels/schemas/label.schema"

const COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
  "#10b981", // emerald-500
  "#14b8a6", // teal-500
  "#06b6d4", // cyan-500
  "#0ea5e9", // sky-500
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#d946ef", // fuchsia-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
  "#e11d48", // rose-600
  "#c026d3", // fuchsia-600
  "#9333ea", // purple-600
  "#7c3aed", // violet-600
  "#4f46e5", // indigo-600
  "#2563eb", // blue-600
  "#64748b", // slate-500
] as const

type Color = (typeof COLORS)[number]

interface TaskCardEditLabelProps {
  onOpenChange: (open: boolean) => void
  label: GetCardQuery["card"]["labels"][number]
}

export function TaskCardEditLabel({
  label,
  onOpenChange,
}: TaskCardEditLabelProps) {
  const [updateLabel] = useMutation(UPDATE_LABEL)
  const form = useForm({
    resolver: zodResolver(updateLabelSchema),
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
