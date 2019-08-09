/* eslint-disable import/prefer-default-export */
export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const TOGGLE_VISIBILITY = "TOGGLE_VISIBILITY";

export function updateConfigSettings(state) {
  return { type: UPDATE_SETTINGS, state };
}

export function toggleCCVisibility() {
  return { type: TOGGLE_VISIBILITY };
}

const initialState = {
  finishedLoading: false,
  isDragged: false,
  size: "medium",
  hideCC: false,
  ccBoxSize: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_SETTINGS:
    return {
      ...state,
      ...action.state,
    };
  case TOGGLE_VISIBILITY:
    return {
      ...state,
      hideCC: !state.hideCC,
    };
  default:
    return state;
  }
}
