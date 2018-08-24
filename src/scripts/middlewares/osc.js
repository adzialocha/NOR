import OSC from 'osc-js';

import ActionTypes from '../actionTypes';
import { changeController } from '../actions/controller';
import { changeSession } from '../actions/session';
import { send } from '../actions/osc';

const osc = new OSC();

export const OSC_ACTION = Symbol('osc-middleware-action');
export const OSC_SEND = Symbol('osc-middleware-send');

function registerEventHandlers(store) {
  osc.on('open', () => {
    store.dispatch({
      type: ActionTypes.OSC_OPEN,
    });

    const state = store.getState();
    const id = state.settings.id;
    store.dispatch(send('handshake', id));
  });

  osc.on('close', () => {
    store.dispatch({
      type: ActionTypes.OSC_CLOSE,
    });
  });

  osc.on('error', error => {
    store.dispatch({
      type: ActionTypes.OSC_ERROR,
      error,
    });
  });
}

function registerMessageHandlers(store) {
  osc.on('/session', message => {
    store.dispatch(changeSession(message.args));
  });

  osc.on('/controller', message => {
    store.dispatch(changeController(message.args));
  });
}

function handleAction(store, type) {
  const state = store.getState();
  const { host, port } = state.settings;

  if (type === 'init') {
    registerEventHandlers(store);
    registerMessageHandlers(store);

    store.dispatch({
      type: ActionTypes.OSC_READY,
    });
  } else if (type === 'open') {
    if (!state.osc.isOpen) {
      if (!state.settings.id) {
        store.dispatch({
          type: ActionTypes.OSC_ERROR,
          error: 'Please enter your ID',
        });
        return;
      }
      osc.open({ host, port });
    }
  } else if (type === 'close') {
    if (state.osc.isOpen) {
      osc.close();
    }
  }
}

function sendMessage(address, args) {
  if (typeof args !== 'object') {
    osc.send(new OSC.Message(address, ...args));
  } else {
    const message = new OSC.Message(address);

    args.forEach(item => {
      message.add(item);
    });

    osc.send(message);
  }
}

export default store => next => action => {
  if (OSC_ACTION in action) {
    const { type } = action[OSC_ACTION];
    handleAction(store, type);
  } else if (OSC_SEND in action) {
    const { address, args } = action[OSC_SEND];
    sendMessage(address, args);
  } else {
    return next(action);
  }
};
