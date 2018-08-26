import { combineReducers } from 'redux';

import controller from './controller';
import osc from './osc';
import session from './session';
import settings from './settings';
import view from './view';

const rootReducer = combineReducers({
  controller,
  osc,
  session,
  settings,
  view,
});

export default rootReducer;
