import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'https://stream-cc.gooseman.codes/api',
})

const authLink = setContext(({ operationName }, { headers }) => {
  // get the authentication token from local storage if it exists
  const tokenType = operationName === 'processBitsTransaction' ? 'transactionToken' : 'token'
  const token = localStorage.getItem(tokenType)

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})
