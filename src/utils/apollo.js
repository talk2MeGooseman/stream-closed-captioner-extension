import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities';
import * as AbsintheSocket from '@absinthe/socket'
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link'
import { Socket as PhoenixSocket } from 'phoenix'

export const phxSocket = new PhoenixSocket("wss://stream-cc.gooseman.codes/socket", {
  params: () => {
    const token = localStorage.getItem('token')
    if (token) {
      return { Authorization: `Bearer ${token}` }
    } else {
      return {}
    }
  }
})

export const absintheSocketLink = createAbsintheSocketLink(
  AbsintheSocket.create(phxSocket),
)

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

// Chain the HTTP link and the authorization link.
const authedHttpLink = authLink.concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  absintheSocketLink,
  authedHttpLink,
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(splitLink),
})
