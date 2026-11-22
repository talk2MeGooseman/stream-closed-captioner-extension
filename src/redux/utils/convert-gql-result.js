import { path, applySpec } from 'ramda'

export const convertGqlResult = applySpec({
  activated: path(['data', 'channelInfo', 'translations', 'activated']),
  balance: path(['data', 'channelInfo', 'bitsBalance', 'balance']),
  costreamEnabled: path(['data', 'channelInfo', 'costreamEnabled']),
  created_at: path(['data', 'channelInfo', 'translations', 'createdAt']),
  languages: path(['data', 'channelInfo', 'translations', 'languages']),
})
