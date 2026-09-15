import { useQuery } from "@apollo/client/react"
import { GET_BOARD } from "../graphql/queries"
import { PageLoader } from "@/components/page-loader/page-loader"
import { Navbar } from "@/components/navbar/navbar"
import { Board } from "./board"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"

export function BoardContent({ id }: { id: string }) {
  const { data, loading, error } = useQuery(GET_BOARD, {
    variables: { id },
  })

  if (loading) {
    return <PageLoader />
  }

  if (error || !data?.board) {
    return <div>Failed to load board.</div>
  }

  return (
    <main className="min-h-screen w-full">
      <Navbar />
      <div>
        <div className="container mx-auto flex items-center justify-between p-3">
          <h2 className="text-xl font-medium">{data.board.title}</h2>
          <div className="flex gap-2">
            <div className="flex">
              {data.board.members.map((member) => (
                <Avatar key={member.user.id}>
                  <AvatarFallback>
                    {member.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button>Invite</Button>
          </div>
          {/* {data.board.members} */}
        </div>
      </div>
      <div className="container mx-auto flex gap-3 overflow-x-auto p-2 pb-4">
        <Board board={data.board} />
      </div>
    </main>
  )
}
