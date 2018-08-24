import ActionTypes from '../actionTypes';

export function changeOrientation(name) {
  return {
    type: ActionTypes.VIEW_ORIENTATION_CHANGE,
    name,
  };
};
