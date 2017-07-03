import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import Root from './components/Root'
import markets from './reducers/markets'
import network from './reducers/network'

const mainReducer = combineReducers({
  markets,
  network,
})

const middlewares = [thunk, logger]

const store = createStore(mainReducer, {}, applyMiddleware(...middlewares))

render(
  <Root store={store} />,
  document.getElementById('root')
)

import { startWeb3 } from './network'
startWeb3(store.dispatch)
