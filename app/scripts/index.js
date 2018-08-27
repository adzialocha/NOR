import '../styles/app.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import configureStore from './store';
import { App } from './views';
import { changeOrientation } from './actions/view';
import { initializeApp, unloadApp } from './actions/app';

const store = configureStore();

function checkOrientation() {
  const orientation = window.innerWidth < window.innerHeight ? 'portrait' : 'landscape';
  store.dispatch(changeOrientation(orientation));
}

store.dispatch(initializeApp());

window.onbeforeunload = () => {
  store.dispatch(unloadApp());
};

window.addEventListener('resize', () => {
  checkOrientation();
});

document.body.addEventListener('touchmove', event => {
  event.preventDefault(); // ios momentum scroll hack
}, false);

checkOrientation();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
