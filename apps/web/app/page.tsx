import { Navbar } from "@/components/navbar/navbar"
import { RequireAuth } from "@/features/auth/components/require-auth"
import { MyBoards } from "@/features/boards/components/my-boards"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kanban",
}

export default function Page() {
  return (
    <RequireAuth>
      <Navbar />
      <MyBoards />
    </RequireAuth>
  )
}
