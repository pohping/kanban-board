"use client"

import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"
import { ME } from "../graphql/queries"
import { useQuery } from "@apollo/client/react"
import { PageLoader } from "@/components/page-loader/page-loader"

export function RequireAuth({ children }: PropsWithChildren) {
  const router = useRouter()

  const { data, loading, error } = useQuery(ME, {
    errorPolicy: "all",
  })

  const isUnauthenticated = !loading && (!data?.me || !!error)

  useEffect(() => {
    if (isUnauthenticated) {
      router.replace("/login")
    }
  }, [isUnauthenticated, router])

  if (loading) {
    return <PageLoader />
  }

  if (isUnauthenticated) {
    return null
  }

  return <>{children}</>
}
