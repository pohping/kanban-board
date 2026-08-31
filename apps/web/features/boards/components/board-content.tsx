import { useQuery } from "@apollo/client/react"
import { GET_BOARD } from "../graphql/queries"
import { PageLoader } from "@/components/page-loader/page-loader"
import { Navbar } from "@/components/navbar/navbar"
import { Board } from "./board"

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
    <main className="min-h-screen w-full bg-background">
      <Navbar />
      <div className="container mx-auto flex h-screen gap-3 p-4">
        <Board board={data.board} />
      </div>
    </main>
  )
}
