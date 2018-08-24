import ActionTypes from '../actionTypes';

export function changeOrientation(name) {
  return {
    type: ActionTypes.ORIENTATION_CHANGE,
    name,
  };
};
