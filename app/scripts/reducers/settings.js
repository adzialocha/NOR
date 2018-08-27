import update from 'immutability-helper';

import ActionTypes from '../actionTypes';
import { getItem, setItem, hasItem } from '../services/storage';

const STORAGE_KEY = 'settings';

const initialState = {
  host: '1.1.1.100',
  port: 9789,
  id: '',
};

function updateStorage(state) {
  setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export default function settings(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SETTINGS_SAVE:
      return updateStorage(
        update(state, { $set: action.settings }),
      );
    case ActionTypes.SETTINGS_LOAD:
      if (hasItem(STORAGE_KEY)) {
        return update(state, { $set: JSON.parse(getItem(STORAGE_KEY)) });
      }

      return state;
    case ActionTypes.SETTINGS_RESET:
      return updateStorage(
        update(state, { $set: initialState }),
      );
    default:
      return state;
  }
}
