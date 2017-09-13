import TruffleContract from 'truffle-contract';
import PredictionMarketArtifacts from '../../../build/contracts/PredictionMarket.json';
import _ from 'lodash';
import {
  TARGET_LIVE_NETWORK,
  MARKET_ADDRESS, STORAGE_MARKET_KEY, USE_CACHE
} from '../../constants';

export const CONNECT_MARKET = 'prediction/CONNECT_MARKET';
export const UPDATE_MARKET = 'prediction/UPDATE_MARKET';

export function connectMarket() {
  return async function(dispatch, getState) {
    console.log('connectMarket()');

    const web3 = getState().network.web3;
    const marketAddress = MARKET_ADDRESS[TARGET_LIVE_NETWORK];

    // Try to retrieve from cache.
    const cached = retrieveCachedMarket(marketAddress);
    const market = cached ? cached : {};

    // Retrieve market contract.
    let contract = getState().market.contract;
    if(!contract) {
      const Market = TruffleContract(PredictionMarketArtifacts);
      Market.setProvider(web3.currentProvider);
      try {
      contract = await Market.at(marketAddress);
      }
      catch(err) {
        console.log('error connecting market:', err);
      }
      // console.log('market contract retrieved');
    }
    market.contract = contract;
    cacheMarket(marketAddress, market);

    // Get prediction info.
    market.address = contract.address;
    let minWithdrawPeriod = getState().market.minWithdrawPeriod;
    if(!minWithdrawPeriod) {
      // console.log('market delta retrieved');
      market.minWithdrawPeriod = ( await contract.minWithdrawPeriod.call() ).toNumber();
      cacheMarket(marketAddress, market);
    }
    dispatch({
      type: CONNECT_MARKET,
      payload: market
    });

    dispatch(updateDynamicMarketData());
    // console.log('market', market);
  };
}

export function updateDynamicMarketData() {
  return async function(dispatch, getState) {
    const contract = getState().market.contract;
    const market = getState().market;
    market.predictionAddresses = (await contract.getPredictions()).reverse();
    cacheMarket(market.address, market);
    dispatch({
      type: UPDATE_MARKET,
      payload: market
    });
  };
}

// ----------------------------------
// Utils
// ----------------------------------

function retrieveCachedMarket(address) {
  const cachedRaw = window.localStorage[STORAGE_MARKET_KEY + address];
  return cachedRaw ? JSON.parse(cachedRaw) : null;
}

function cacheMarket(address, prediction) {
  if(!USE_CACHE) return;
  const toCache = _.omit(prediction, 'contract');
  window.localStorage[STORAGE_MARKET_KEY + address] = JSON.stringify(toCache);
}
