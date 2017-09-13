import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import NetworkReducer from '../network/NetworkReducer';
import PredictionReducer from '../prediction/PredictionReducer';
import MarketReducer from '../market/MarketReducer';

const reducer = combineReducers({
  routing: routerReducer,
  network: NetworkReducer,
  market: MarketReducer,
  prediction: PredictionReducer
});

export default reducer;
