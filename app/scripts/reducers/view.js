import update from 'immutability-helper';

import ActionTypes from '../actionTypes';

const initialOrientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;

const initialState = {
  currentOrientation: initialOrientation,
};

export default function view(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.VIEW_ORIENTATION_CHANGE:
      return update(state, {
        currentOrientation: { $set: action.name },
      });
    default:
      return state;
  }
}
