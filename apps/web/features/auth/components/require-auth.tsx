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

  useEffect(() => {
    if (!loading && (!data?.me || error)) {
      router.replace("/login")
    }
  }, [data, loading, router, error])

  if (loading) {
    return <PageLoader />
  }

  if (!data?.me || error) {
    return null
  }

  return <>{children}</>
}
