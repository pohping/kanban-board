import { useQuery } from "@apollo/client/react"
import { ME } from "../graphql/queries"

export function useAuth() {
  const { data, loading, error } = useQuery(ME, {
    fetchPolicy: "cache-and-network",
  })

  return {
    user: data?.me ?? null,
    isLoading: loading,
    isAuthenticated: !!data?.me,
    error,
  }
}
