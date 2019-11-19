import { actionToggleActivationDrawer, requestTranslationStatus } from "./config-settings-action-reducer";

/* eslint-disable no-case-declarations */
/* eslint-disable import/prefer-default-export */
export const SET_PRODUCTS = "SET_PRODUCTS";
export const SEND_USE_BITS = "SEND_USE_BITS";
export const COMPLETE_USE_BITS = "COMPLETE_USE_BITS";
export const SET_CHANNEL_ID = "SET_CHANNEL_ID";
export const SET_SELECTED_PRODUCT = "SET_SELECTED_PRODUCT";

export function setProducts(products) {
  return { type: SET_PRODUCTS, products };
}

export function sendUseBits(sku) {
  return { type: SEND_USE_BITS, sku };
}

export function completeUseBits(transaction) {
  return { type: COMPLETE_USE_BITS, transaction };
}

export function setChannelId(channelId) {
  return { type: SET_CHANNEL_ID, channelId };
}

export function setSelectedProduct(product) {
  return { type: SET_SELECTED_PRODUCT, product };
}

export function useBits(sku) {
  return function thunk(dispatch, getState) {
    dispatch(sendUseBits(sku));

    const twitchLib = window.Twitch ? window.Twitch.ext : null;
    twitchLib.bits.useBits(sku);
  };
}

export function completeBitsTransaction(transaction) {
  return function thunk(dispatch, getState) {
    dispatch(completeUseBits(transaction));


    const { channelId } = getState().productsCatalog;

    return fetch("https://stream-cc.gooseman.codes/api/bits_transactions", {
      cache: "no-cache",
      method: "POST",
      headers: {
        Authorization: `Bearer ${transaction.transactionReceipt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId,
      }),
    }).then((response) => {
      if (response.ok) {
        // log("ebs validated transaction");
        dispatch(actionToggleActivationDrawer());
        dispatch(requestTranslationStatus());
      } else {
        // log("ebs was unable to validate transaction");
      }
    });
  };
}

function compare(a, b) {
  if (a.cost.amount < b.cost.amount) {
    return -1;
  }
  if (a.cost.amount > b.cost.amount) {
    return 1;
  }
  return 0;
}

const initialState = {
  channelId: null,
  products: [],
  processing: false,
  sent_sku: null,
  transaction: null,
  selectedProduct: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SET_CHANNEL_ID:
    return {
      ...state,
      channelId: action.channelId,
    };
  case SET_PRODUCTS:
    const sortedProduct = action.products.sort(compare);
    return {
      ...state,
      products: sortedProduct,
      selectedProduct: sortedProduct[0],
    };
  case SEND_USE_BITS:
    return {
      ...state,
      sent_sku: action.sku,
      processing: true,
    };
  case COMPLETE_USE_BITS:
    return {
      ...state,
      sent_sku: null,
      processing: false,
      transaction: action.transaction,
    };
  case SET_SELECTED_PRODUCT:
    return {
      ...state,
      selectedProduct: action.product,
    };
  default:
    return state;
  }
}
