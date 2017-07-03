import React from 'react';
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router'

import MainPage from './MainPage'
import MarketPage from './MarketPage'

import createBrowserHistory from 'history/createBrowserHistory'
const browserHistory = createBrowserHistory()

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/predictions/:address" component={MarketPage} />
      </Switch>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root
