import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { history, configuredStore } from './store';
import './App.global.css';

const store = configuredStore();

const Root = require('./containers/Root').default;

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

// const AppContainer = ReactHotAppContainer;

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);
