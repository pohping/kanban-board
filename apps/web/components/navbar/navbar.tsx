"use client"

import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { Brand } from "../brand/brand"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useApolloClient, useMutation } from "@apollo/client/react"
import { LOGOUT } from "@/features/auth/graphql/mutations"
import { useRouter } from "next/navigation"

export function Navbar() {
  const router = useRouter()
  const client = useApolloClient()
  const { user, isLoading } = useAuth()
  const [logout, { loading }] = useMutation(LOGOUT)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error("Logout mutation error:", e)
    } finally {
      await client.clearStore()

      router.replace("/login")
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Brand />
        <div className="item-center flex gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-26" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 cursor-pointer rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 p-1">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-sm font-medium">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer gap-2 px-2 py-2">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 px-2 py-2">
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 px-2 py-2"
                  onClick={handleLogout}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
