/* eslint-disable import/prefer-default-export */
export const UPDATE_PLAYER_CONTEXT = 'UPDATE_PLAYER_CONTEXT';

export function updatePlayerContext(state) {
  return { type: UPDATE_PLAYER_CONTEXT, state };
}

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_PLAYER_CONTEXT:
    return {
      ...state,
      ...action.state,
    };
  default:
    return state;
  }
}
