"use client"

import { useQuery } from "@apollo/client/react"
import { MY_BOARDS } from "../graphql/queries"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export function MyBoards() {
  const { data } = useQuery(MY_BOARDS)

  return (
    <div className="container mx-auto">
      <div className="mt-4 grid grid-cols-3 gap-4">
        {data?.myBoards.map((board) => (
          <Link key={board.id} href={`/boards/${board.id}`}>
            <Card className="h-[200px] cursor-pointer shadow-sm transition-shadow hover:shadow-lg">
              <CardContent className="h-full text-base font-medium">
                {board.title}
              </CardContent>
              <CardFooter>
                <p>
                  {board.columns.reduce(
                    (acc, col) => acc + col.cards.length,
                    0
                  )}{" "}
                  Tasks
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
        <Card className="h-[200px] cursor-pointer shadow-sm transition-shadow hover:shadow-lg">
          <CardContent className="flex h-full items-center justify-center gap-2 text-base font-medium text-muted-foreground">
            <Plus />
            <span>Create New Board</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
