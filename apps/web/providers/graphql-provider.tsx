"use client"

import { graphqlClient } from "@/lib/graphql/client"
import { ApolloProvider } from "@apollo/client/react"

export function GraphQLProvider({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>
}
