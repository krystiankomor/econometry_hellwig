/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './App';
import HomePage from './containers/StartPage';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CalculationsPage')
);

// Lazily load routes and code split with webpack
const LazyChartsPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/ChartsPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

const ChartsPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyChartsPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.CHARTS} component={ChartsPage} />
        <Route path={routes.CALCULATIONS} component={CounterPage} />
        <Route path={routes.START} component={HomePage} />
      </Switch>
    </App>
  );
}
