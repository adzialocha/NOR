import update from 'immutability-helper';

import ActionTypes from '../actionTypes';

export const EQ_BIN_NUM = 128;

const initialState = {
  chaos: false,
  compressor: false,
  microphoneA: false,
  microphoneB: false,
  reverb: false,
  eq: new Array(EQ_BIN_NUM).fill(0.0),
};

function updateValues(state, start, end, newValue) {
  const newValues = state.eq.map((value, index) => {
    if (index >= start && index <= end) {
      return newValue;
    }
    return value;
  });

  return update(state, {
    eq: { $set: newValues },
  });
}

export default function controller(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.CONTROLLER_SET_STATUS:
      return update(state, {
        [action.name]: { $set: action.value },
      });
    case ActionTypes.CONTROLLER_CHANGE_VALUES:
      return updateValues(state, action.start, action.end, action.value);
    default:
      return state;
  }
}
