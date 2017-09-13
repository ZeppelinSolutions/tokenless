import store from './main/store';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { Router, Route, Redirect } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppComponent from './main/components/AppComponent';
import NotFoundComponent from './main/components/NotFoundComponent';
import PredictionComponent from './prediction/containers/PredictionComponent';
import CreatePredictionComponent from './market/containers/CreatePredictionComponent';
import MarketComponent from './market/containers/MarketComponent';
import AboutComponent from './about/components/AboutComponent';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import numberLocalizer from 'react-widgets/lib/localizers/simple-number';
import { connectNetwork } from './network/actions';
import {
  PATH_PREDICTION,
  PATH_CREATE,
  PATH_ABOUT, USE_CACHE, PATH_LIST
} from './constants';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/themes/bootstrap-slate-theme.css';
import 'react-widgets/dist/css/react-widgets.css';

// Init localization.
momentLocalizer(moment);
numberLocalizer();

window.addEventListener('load', () => {

  // Initialize web3 and store in state.
  store.dispatch(connectNetwork());

  // UI entry point and routes.
  ReactDOM.render((
      <Provider store={store}>
        <Router history={syncHistoryWithStore(browserHistory, store)}>
          <Redirect from="/" to="list/0"/>
          <Route path="/" component={AppComponent}>
            <Route path={PATH_LIST} component={MarketComponent}/>
            <Route path={PATH_CREATE} component={CreatePredictionComponent}/>
            <Route path={PATH_PREDICTION} component={PredictionComponent}/>
            <Route path={PATH_ABOUT} component={AboutComponent}/>
            <Route path='*' exact={true} component={NotFoundComponent}/>
          </Route>
        </Router>
      </Provider>
    ),
    document.getElementById('root')
  );
});

// Clear cache?
if(!USE_CACHE) {
  window.localStorage.clear();
}