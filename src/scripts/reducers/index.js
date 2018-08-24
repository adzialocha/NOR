import { combineReducers } from 'redux';

import controller from './controller';
import osc from './osc';
import settings from './settings';
import view from './view';

const rootReducer = combineReducers({
  controller,
  osc,
  settings,
  view,
});

export default rootReducer;
