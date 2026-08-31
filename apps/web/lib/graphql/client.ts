import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client"

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL

if (!graphqlUrl) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_URL is not defined")
}

export const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: graphqlUrl,
    credentials: "include",
  }),
})
