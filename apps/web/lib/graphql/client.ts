import {
  HttpLink,
  ApolloClient,
  InMemoryCache,
  CombinedGraphQLErrors,
  ApolloLink,
} from "@apollo/client"
import { ErrorLink } from "@apollo/client/link/error"

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/graphql"

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: "include",
})

const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) return // network error, not GraphQL error

  const isUnauthenticated = error.errors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED"
  )
  if (isUnauthenticated || typeof window !== "undefined") return

  // clear cookies
  fetch(GRAPHQL_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: `mutation { logout }` }),
  }).finally(() => {
    const callbackUrl = encodeURIComponent(window.location.pathname)
    window.location.href = `/login?callbackUrl=${callbackUrl}`

    // window.location.replace(
    //   `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    // )
  })
})

export const graphqlClient = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})
