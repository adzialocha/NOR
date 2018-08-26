import { init, open, close } from './osc';
import { loadSettings } from './settings';

export function initializeApp() {
  return dispatch => {
    dispatch(init());

    dispatch(loadSettings());

    dispatch(open());
  };
};

export function unloadApp() {
  return dispatch => {
    dispatch(close());
  };
}
