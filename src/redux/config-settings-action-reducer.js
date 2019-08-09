import uuid from "uuid/v4";

/* eslint-disable import/prefer-default-export */
export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const TOGGLE_VISIBILITY = "TOGGLE_VISIBILITY";
export const TOGGLE_BOX_SIZE = "TOGGLE_TO_BOX_SIZE ";
export const CHANGE_TEXT_SIZE = "CHANGE_TEXT_SIZE";
export const SET_IS_DRAGGED = "SET_IS_DRAGGED";
export const RESET_CC_TEXT = "RESET_CC_TEXT";

export function updateConfigSettings(state) {
  return { type: UPDATE_SETTINGS, state };
}

export function toggleCCVisibility() {
  return { type: TOGGLE_VISIBILITY };
}

export function actionToggleBoxSize() {
  return { type: TOGGLE_BOX_SIZE };
}

export function actionSetIsDragged() {
  return { type: SET_IS_DRAGGED };
}

export function actionResetCC() {
  return { type: RESET_CC_TEXT };
}

export function actionChangeTextSize(size) {
  return {
    type: CHANGE_TEXT_SIZE,
    state: {
      size,
    },
  };
}

const initialState = {
  finishedLoading: false,
  isDragged: false,
  size: "medium",
  hideCC: false,
  ccBoxSize: false,
  ccKey: uuid(),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_SETTINGS:
  case CHANGE_TEXT_SIZE:
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
  case SET_IS_DRAGGED:
    return {
      ...state,
      isDragged: true,
    };
  case RESET_CC_TEXT:
    return {
      ...state,
      ccKey: uuid(),
    };
  default:
    return state;
  }
}
