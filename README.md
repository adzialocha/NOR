NOR
===

```
0 0 1
0 1 0
1 0 0
1 1 0
```

Interface for musical free improvisation in a highly artifical environment, using [osc-js](https://github.com/adzialocha/osc-js) to communicate to Ableton Live and [React](https://facebook.github.io/react/) for UI.

![NOR](https://github.com/adzialocha/NOR/blob/master/NOR.gif)

### Requirements

* node.js and npm
* yarn

### Install

```
yarn install
```

### Usage

Run `yarn build` to build the application for production and then `yarn serve` to start the http server which will listen by default to port `3000`. You can change the network settings in `options.json`.
