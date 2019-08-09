/* eslint-disable import/prefer-default-export */
export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const TOGGLE_VISIBILITY = "TOGGLE_VISIBILITY";
export const TOGGLE_BOX_SIZE = "TOGGLE_TO_BOX_SIZE ";

export function updateConfigSettings(state) {
  return { type: UPDATE_SETTINGS, state };
}

export function toggleCCVisibility() {
  return { type: TOGGLE_VISIBILITY };
}

export function actionToggleBoxSize() {
  return { type: TOGGLE_BOX_SIZE };
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
  case TOGGLE_BOX_SIZE:
    return {
      ...state,
      ccBoxSize: !state.ccBoxSize,
    };
  default:
    return state;
  }
}
