"use client"

import { useQuery } from "@apollo/client/react"
import { useRouter, useSearchParams } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"
import { ME } from "../graphql/queries"

export function GuestOnly({ children }: PropsWithChildren) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, loading } = useQuery(ME)

  useEffect(() => {
    if (!loading && data?.me) {
      const callbackUrl = searchParams.get("callbackUrl")

      if (callbackUrl) {
        router.replace(callbackUrl)
      } else {
        router.replace("/")
      }
    }
  }, [data, loading, router, searchParams])

  if (loading || data?.me) {
    return null
  }

  return <>{children}</>
}
