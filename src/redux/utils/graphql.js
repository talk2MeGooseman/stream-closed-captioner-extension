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

// Guest (co-streamer) captions ride a separate subscription so extension
// versions released before this feature keep working untouched — their
// hardcoded newTwitchCaption query never sees guest text.
export const subscriptionNewCostreamCaptions = gql`
  subscription OnCostreamCaption($channelId: ID!) {
    newCostreamCaption(channelId: $channelId) {
      guestId
      name
      interim
      final
    }
  }
`
