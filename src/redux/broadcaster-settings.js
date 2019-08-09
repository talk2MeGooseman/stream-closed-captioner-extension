/* eslint-disable import/prefer-default-export */
export const UPDATE_BROADCASTER_SETTINGS = "UPDATE_BROADCASTER_SETTINGS";

export function updateBroadcasterSettings(state) {
  return { type: UPDATE_BROADCASTER_SETTINGS, state };
}

const initialState = {
  finishedLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_BROADCASTER_SETTINGS:
    return {
      ...state,
      ...action.state,
    };
  default:
    return state;
  }
}
