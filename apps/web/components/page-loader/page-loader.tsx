import { Spinner } from "@workspace/ui/components/spinner"
import { ComponentPropsWithoutRef } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface PageLoaderProps extends ComponentPropsWithoutRef<"div"> {}

export function PageLoader({ className, ...props }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-white/40 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="animate-bounce text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  )
}
