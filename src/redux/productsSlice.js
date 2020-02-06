/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { toggleActivationDrawer } from './settingsSlice'
import { requestTranslationStatus } from './translationSlice'

function compare(a, b) {
  if (a.cost.amount < b.cost.amount) {
    return -1
  }
  if (a.cost.amount > b.cost.amount) {
    return 1
  }
  return 0
}

const initialState = {
  channelId: null,
  products: [],
  processing: false,
  sent_sku: null,
  transaction: null,
  selectedProduct: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setChannelId(state, action) {
      state.channelId = action.payload
    },
    setProducts(state, action) {
      const products = action.payload
      const sortedProducts = products.sort(compare)
      const [firstProduct] = sortedProducts
      state.products = sortedProducts
      state.selectedProduct = firstProduct
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload
    },
    sendUseBits(state, action) {
      state.sent_sku = action.payload
      state.processing = true
    },
    cancelUseBits(state) {
      console.log('Cancelled')
      state.sent_sku = null
      state.processing = false
    },
    completeUseBits(state, action) {
      state.sent_sku = null
      state.processing = false
      state.transaction = action.payload
    },
  },
})

export const {
  setChannelId,
  setProducts,
  setSelectedProduct,
  sendUseBits,
  completeUseBits,
  cancelUseBits,
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
      cache: 'no-cache',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${transaction.transactionReceipt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId,
      }),
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
