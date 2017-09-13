import TruffleContract from 'truffle-contract';
import PredictionArtifacts from '../../../build/contracts/Prediction.json';
import * as web3util from '../../utils/Web3Util';
import * as stateUtil from '../../utils/PredictionState';
import _ from 'lodash';
import {STORAGE_PREDICTION_KEY, STORAGE_PREVIEW_KEY, USE_CACHE} from "../../constants";

export const GET_PREDICTION_PREVIEW = 'prediction/GET_PREDICTION_PREVIEW';

export function getPredictionPreview(address) {
  return async function(dispatch, getState) {
    console.log('getMarketPreview()', address);

    const web3 = getState().network.web3;

    // Skip if preview has already been obtained.
    if(getState().market.previews[address]) {
      console.log('preview already fetched');
      return;
    }

    // Try to retrieve preview from cache.
    let cached;
    if(USE_CACHE) {
      const cachedRaw = window.localStorage[STORAGE_PREVIEW_KEY + address];
      if(cachedRaw) {
        // console.log('using cached version');
        cached = JSON.parse(cachedRaw);
      }
    }

    // Try to reuse a cached prediction to populate the preview.
    if(USE_CACHE && !cached) {
      const cachedPredRaw = window.localStorage[STORAGE_PREDICTION_KEY + address];
      console.log('reusing cached prediction to consolidate preview');
      if(cachedPredRaw) {
        const cachedPred = JSON.parse(cachedPredRaw);
        cached = _.pick(cachedPred, [
          'statement',
          'balance',
          'predictionState',
          'predictionStateStr'
        ]);
      }
    }

    // Dispatch a dummy preview to express that
    // the preview is being fetched.
    const preview = cached ? cached : {};
    preview.address = address;
    preview.isFetching = cached === undefined;
    dispatch({
      type: GET_PREDICTION_PREVIEW,
      payload: preview
    });

    // Retrieve prediction.
    const Prediction = TruffleContract(PredictionArtifacts);
    Prediction.setProvider(web3.currentProvider);
    const contract = await Prediction.at(address);

    // Dispatch populated preview.
    preview.balance = await web3util.getBalanceInEther(address, web3);
    if(!preview.statement) preview.statement = await contract.statement.call();
    preview.predictionState = (await contract.getState()).toNumber();
    preview.predictionStateStr = stateUtil.predictionStateToStr(preview.predictionState);
    preview.isFetching = false;
    // console.log('prediction: ', prediction);
    dispatch({
      type: GET_PREDICTION_PREVIEW,
      payload: preview
    });

    // Store in cache.
    if(USE_CACHE) {
      // console.log('caching preview...');
      const key = STORAGE_PREVIEW_KEY + address;
      const toCache = _.omit(preview, 'isFetching');
      // console.log('data', key, toCache);
      window.localStorage[key] = JSON.stringify(toCache);
    }
  };
}
