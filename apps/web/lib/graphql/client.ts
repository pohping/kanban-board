import {
  HttpLink,
  ApolloClient,
  InMemoryCache,
  CombinedGraphQLErrors,
  ApolloLink,
} from "@apollo/client"
import { ErrorLink } from "@apollo/client/link/error"

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "/api/graphql"

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: "include",
})

const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) return // network error, not GraphQL error

  const isUnauthenticated = error.errors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED"
  )
  if (!isUnauthenticated || typeof window === "undefined") return

  window.location.replace(
    `/login?callbackUrl=${encodeURIComponent(
      window.location.pathname + window.location.search
    )}`
  )
})

export const graphqlClient = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})
