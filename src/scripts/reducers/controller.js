import update from 'immutability-helper';

import ActionTypes from '../actionTypes';

const initialState = {
  chaos: false,
  compressor: false,
  microphoneA: false,
  microphoneB: false,
  reverb: false,
  eq: [],
};

export default function editor(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.CONTROLLER_TOGGLE_STATUS:
      return update(state, {
        [action.name]: { $set: !state[action.name] },
      });
    default:
      return state;
  }
}
