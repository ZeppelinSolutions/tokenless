import {STORAGE_PREDICTION_KEY, USE_CACHE} from "../../../constants";
import _ from 'lodash';

export function retrieveCachedPrediction(address) {
  const cachedRaw = window.localStorage[STORAGE_PREDICTION_KEY + address];
  return cachedRaw ? JSON.parse(cachedRaw) : null;
}

export function cachePrediction(address, prediction) {
  if(!USE_CACHE) return;
  const toCache = _.omit(prediction, 'contract');
  window.localStorage[STORAGE_PREDICTION_KEY + address] = JSON.stringify(toCache);
}

// Check if the app is no longer poiting to this prediction after
// async callbacks.
export function checkContinue(address, getState) {
  // console.log('checkContinue()');
  let cont = false;
  const targetAddress = getState().prediction.targetPredictionAddress;
  if(!cont && !address) cont = true;
  if(!cont && !targetAddress) cont = true;
  if(!cont && targetAddress === address) cont = true;
  // console.log('cont', cont);
  return cont;
}