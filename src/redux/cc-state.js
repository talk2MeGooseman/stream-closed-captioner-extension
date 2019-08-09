/* eslint-disable import/prefer-default-export */
export const UPDATE_CC_STATE = "UPDATE_CC_STATE";

export function updateCCState(state) {
  return { type: UPDATE_CC_STATE, state };
}

const initialState = {
  finalTextQueue: [],
  interimText: "",
  translations: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_CC_STATE:
    return {
      ...state,
      ...action.state,
    };
  default:
    return state;
  }
}
