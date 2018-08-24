import ActionTypes from '../actionTypes';

import { send } from '../actions/osc';

export function changeValues(start, end, value) {
  return dispatch => {
    dispatch(send(['controller', 'eq'], value, start, end));

    dispatch({
      end,
      start,
      type: ActionTypes.CONTROLLER_CHANGE_VALUES,
      value,
    });
  };
};

export function toggleStatus(name) {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(setStatus(name, !state.controller[name]));
  };
};

export function setStatus(name, value) {
  return dispatch => {
    dispatch(send(['controller', name], value ? 1 : 0));

    dispatch({
      type: ActionTypes.CONTROLLER_SET_STATUS,
      name,
      value,
    });
  };
};

export function changeController(args) {
  const [key, value] = args;
  if (key === 'eq') {
    return changeValues(args[2], args[3], value);
  }
  return setStatus(key, value);
}
