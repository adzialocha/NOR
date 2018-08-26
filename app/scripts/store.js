import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import osc from './middlewares/osc';
import reducers from './reducers';

let store;

export default function configureStore() {
  const middleware = [
    osc,
    thunk,
  ];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
  }

  store = createStore(
    reducers,
    applyMiddleware(...middleware),
  );

  return store;
}

export function getStore() {
  return store;
}
