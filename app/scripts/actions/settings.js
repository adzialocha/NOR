import ActionTypes from '../actionTypes';

export function loadSettings() {
  return {
    type: ActionTypes.SETTINGS_LOAD,
  };
};

export function saveNetworkSettings(settings) {
  return {
    settings,
    type: ActionTypes.SETTINGS_SAVE,
  };
};

export function resetSettings() {
  return {
    type: ActionTypes.SETTINGS_RESET,
  };
};
