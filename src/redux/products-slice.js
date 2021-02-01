import { createSlice } from '@reduxjs/toolkit'
import { sort } from 'ramda'

import { toggleActivationDrawer } from './settings-slice'
import { requestTranslationStatus } from './translation-slice'

const sortByCost = sort(function compare(a, b) {
  if (a.cost.amount < b.cost.amount) {
    return -1
  }
  if (a.cost.amount > b.cost.amount) {
    return 1
  }
  return 0
})

const initialState = {
  channelId: null,
  processing: false,
  products: [],
  // eslint-disable-next-line camelcase
  sent_sku: null,
  transaction: null,
}

const productsSlice = createSlice({
  initialState,
  name: 'products',
  reducers: {
    completeUseBits(state, action) {
      // eslint-disable-next-line camelcase
      state.sent_sku = null
      state.processing = false
      state.transaction = action.payload
    },
    sendUseBits(state, action) {
      // eslint-disable-next-line camelcase
      state.sent_sku = action.payload
      state.processing = true
    },
    setChannelId(state, action) {
      state.channelId = action.payload
    },
    setProducts(state, action) {
      const sortedProduct = sortByCost(action.payload)
      const [firstProduct] = sortedProduct

      state.products = sortedProduct
      state.selectedProduct = firstProduct
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload
    },
  },
})

export const {
  setChannelId,
  setProducts,
  setSelectedProduct,
  sendUseBits,
  completeUseBits,
} = productsSlice.actions

export function useBits(sku) {
  return function thunk(dispatch) {
    dispatch(sendUseBits(sku))

    const twitchLib = window.Twitch ? window.Twitch.ext : null

    twitchLib.bits.useBits(sku)
  }
}

export function completeBitsTransaction(transaction) {
  return function thunk(dispatch, getState) {
    dispatch(completeUseBits(transaction))

    const { channelId } = getState().productsCatalog

    return fetch('https://stream-cc.gooseman.codes/api/bits_transactions', {
      body: JSON.stringify({
        channelId,
      }),
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${transaction.transactionReceipt}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((response) => {
      if (response.ok) {
        dispatch(toggleActivationDrawer())
        dispatch(requestTranslationStatus())
      } else {
        // log("ebs was unable to validate transaction");
      }
    })
  }
}

export default productsSlice.reducer
