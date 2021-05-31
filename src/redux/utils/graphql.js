import { gql } from '@apollo/client'

export const queryGetChannelInfo = gql`
  query getChannelInfo($id: ID!) {
    channelInfo(id: $id) {
      bitsBalance {
        balance
      }
      translations {
        activated
        createdAt
        languages
      }
      uid
    }
  }
`

export const mutationProcessTransaction = gql`
  mutation processBitsTransaction($channelId: ID!) {
    processBitsTransaction(channelId: $channelId) {
      message
    }
  }
`

export const subscriptionNewCaptions = gql`
  subscription OnCommentAdded($channelId: ID!) {
    newTwitchCaption(channelId: $channelId) {
      interim
      final
      translations
    }
  }
`
