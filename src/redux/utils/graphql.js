import { gql } from '@apollo/client'

export const query = gql`
  query getTranslationInfo($id: ID!){
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
