import ActionTypes from '../actionTypes';

export function changeSession(args) {
  const [key, value] = args;
  if (key === 'chaos') {
    return {
      type: ActionTypes.SESSION_CHANGE_CHAOS_RATE,
      value,
    };
  } else if (key === 'rainbow') {
    return {
      type: ActionTypes.SESSION_CHANGE_RAINBOW_MODE,
      value: value === 1,
    };
  } else if (key === 'takeover') {
    return {
      type: ActionTypes.SESSION_CHANGE_TAKEOVER_ACTIVE,
      value: value === 1,
    };
  }
}
