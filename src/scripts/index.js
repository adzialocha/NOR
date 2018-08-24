import '../styles/app.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import configureStore from './store';
import { App } from './views';
import { changeOrientation } from './actions/view';
import { initializeApp, unloadApp } from './actions/app';

const store = configureStore();

store.dispatch(initializeApp());

window.onbeforeunload = () => {
  store.dispatch(unloadApp());
};

window.addEventListener('orientationchange', () => {
  const orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
  store.dispatch(changeOrientation(orientation));
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
