import { Spinner } from "@workspace/ui/components/spinner"

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="animate-bounce text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  )
}
