import uuid from "uuid/v4";

/* eslint-disable import/prefer-default-export */
export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const TOGGLE_VISIBILITY = "TOGGLE_VISIBILITY";
export const TOGGLE_BOX_SIZE = "TOGGLE_TO_BOX_SIZE ";
export const CHANGE_TEXT_SIZE = "CHANGE_TEXT_SIZE";
export const SET_IS_DRAGGED = "SET_IS_DRAGGED";
export const RESET_CC_TEXT = "RESET_CC_TEXT";
export const SELECT_LANGUAGE = "SELECT_LANGUAGE";
export const TOGGLE_ACTIVATION_DRAWER = "TOGGLE_ACTIVATION_DRAWER ";
export const REQUESTING_TRANSLATIONS_STATUS = "REQUESTING_TRANSLATIONS_STATUS";
export const DONE_REQUESTING_TRANSLATIONS_STATUS = "DONE_REQUESTING_TRANSLATIONS_STATUS";

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

export function actionToggleActivationDrawer() {
  return { type: TOGGLE_ACTIVATION_DRAWER };
}

export function actionChangeTextSize(size) {
  return {
    type: CHANGE_TEXT_SIZE,
    state: {
      size,
    },
  };
}

export function actionChangeSelectedLanguage(language) {
  return {
    type: SELECT_LANGUAGE,
    state: {
      selectedLanguage: language,
    },
  };
}

export function requestingTranslationStatus() {
  return { type: REQUESTING_TRANSLATIONS_STATUS };
}

export function doneRequestingTranslationStatus(activationInfo) {
  return { type: DONE_REQUESTING_TRANSLATIONS_STATUS, activationInfo };
}

export function requestTranslationStatus() {
  return function thunk(dispatch, getState) {
    dispatch(requestingTranslationStatus());

    const { channelId } = getState().productsCatalog;

    return fetch(`https://stream-cc.gooseman.codes/api/translation_status/${channelId}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response.json();
    }).then((data) => {
      dispatch(doneRequestingTranslationStatus(data));
    });
  };
}

const initialState = {
  selectedLanguage: "default",
  finishedLoading: false,
  ccKey: uuid(),
  isDragged: false,
  size: "medium",
  hideCC: false,
  ccBoxSize: false,
  isBitsEnabled: false,
  isDrawerOpen: false,
  fetchingStatus: false,
  activationInfo: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_SETTINGS:
  case CHANGE_TEXT_SIZE:
  case SELECT_LANGUAGE:
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
  case TOGGLE_ACTIVATION_DRAWER:
    return {
      ...state,
      isDrawerOpen: !state.isDrawerOpen,
    };
  case REQUESTING_TRANSLATIONS_STATUS:
    return {
      ...state,
      fetchingStatus: true,
    };
  case DONE_REQUESTING_TRANSLATIONS_STATUS:
    return {
      ...state,
      fetchingStatus: false,
      activationInfo: action.activationInfo,
    };
  default:
    return state;
  }
}
