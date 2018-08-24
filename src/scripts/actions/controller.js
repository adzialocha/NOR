import ActionTypes from '../actionTypes';

export function toggleStatus(name) {
  return {
    type: ActionTypes.CONTROLLER_TOGGLE_STATUS,
    name,
  };
};
