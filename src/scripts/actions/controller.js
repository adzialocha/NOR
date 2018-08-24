import ActionTypes from '../actionTypes';

export function changeValues(start, end, value) {
  return {
    end,
    start,
    type: ActionTypes.CONTROLLER_CHANGE_VALUES,
    value,
  };
};

export function toggleStatus(name) {
  return {
    type: ActionTypes.CONTROLLER_TOGGLE_STATUS,
    name,
  };
};
