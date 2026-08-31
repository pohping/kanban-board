import { Navbar } from "@/components/navbar/navbar"
import { RequireAuth } from "@/features/auth/components/require-auth"
import { MyBoards } from "@/features/boards/components/my-boards"

export default function Page() {
  return (
    <RequireAuth>
      <Navbar />
      <MyBoards />
    </RequireAuth>
  )
}
