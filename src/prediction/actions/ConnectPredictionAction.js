import TruffleContract from 'truffle-contract';
import PredictionArtifacts from '../../../build/contracts/Prediction.json';
import * as web3util from '../../utils/Web3Util';
import * as stateUtil from '../../utils/PredictionState';
import { push } from 'react-router-redux';
import * as util from './utils/PredictionUtil';
import { updateBetHistory } from '.';

export const CONNECT_PREDICTION = 'prediction/CONNECT';
export const UPDATE_PREDICTION = 'prediction/UPDATE_PREDICTION';

// ----------------------------------
// Basic Connection
// ----------------------------------

export function connectPrediction(address) {
  return async function(dispatch, getState) {

    console.log('connectPrediction()', address);

    const web3 = getState().network.web3;

    // Try to retrieve from cache.
    const cached = util.retrieveCachedPrediction(address);
    // console.log('cached:', cached);

    // Extract basic prediction info.
    let prediction = cached ? cached : {};
    prediction.address = address;
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });

    // Retrieve prediction contract.
    const Prediction = TruffleContract(PredictionArtifacts);
    Prediction.setProvider(web3.currentProvider);
    try {
      const contract = await Prediction.at(address);
      console.log('connected to prediction');

      prediction.contract = contract;
      if (!util.checkContinue(address, getState)) return;
      util.cachePrediction(address, prediction);
      dispatch({
        type: UPDATE_PREDICTION,
        payload: prediction
      });

      // Update static data.
      dispatch(updatePredictionStatement(address));
      dispatch(updatePredictionOwner(address));

      // Update dynamic data.
      dispatch(updateDynamicPredictionData(address));
    }
    catch(err) {
      console.log('error connecting prediction:', err);

      // Redirect to 404.
      dispatch(push(`/404`));
    }
  };
}

// ----------------------------------
// Static Data
// ----------------------------------

export function updatePredictionOwner(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    console.log('get owner');
    prediction.owner = await contract.owner.call();
    if (!util.checkContinue(address, getState)) return;
    util.cachePrediction(address, prediction);
    console.log('prediction:', prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionDates(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    console.log('get dates');
    prediction.betEndDate = ( await contract.betEndTimestamp.call() ).toNumber();
    if (!util.checkContinue(address, getState)) return;
    prediction.withdrawPeriod = ( await contract.withdrawPeriod.call() ).toNumber();
    if (!util.checkContinue(address, getState)) return;
    prediction.resolutionTimestamp = ( await contract.resolutionTimestamp.call() ).toNumber();
    if (!util.checkContinue(address, getState)) return;
    // console.log('prediction:', prediction);
    util.cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionStatement(address) {
  console.log('updatePredictionStatement()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    if(prediction.statement) return;
    const contract = getState().prediction.contract;
    prediction.statement = await contract.statement.call();
    if (!util.checkContinue(address, getState)) return;
    util.cachePrediction(address, prediction);
    dispatch({
      type: CONNECT_PREDICTION,
      payload: prediction
    });
  };
}

// ----------------------------------
// Dynamic Data
// ----------------------------------

export function updateDynamicPredictionData(address) {
  console.log('updateDynamicPredictionData()');
  return async function(dispatch, getState) {
    dispatch(updatePredictionDates(address));
    dispatch(updatePredictionState(address));
    dispatch(updatePredictionBalances(address));
    dispatch(updatePredictionPlayerBalances(address));
    dispatch(updateBetHistory(address));

    const prediction = getState().prediction;
    console.log('prediction', prediction);
  };
}

export function updatePredictionPlayerBalances(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    const web3 = getState().network.web3;
    const player = getState().network.activeAccountAddress;
    console.log('get player balances');
    prediction.playerPositiveBalance = +web3.fromWei(await contract.getUserBalance(true, {from: player}), 'ether').toNumber();
    if (!util.checkContinue(address, getState)) return;
    prediction.playerNegativeBalance = +web3.fromWei(await contract.getUserBalance(false, {from: player}), 'ether').toNumber();
    if (!util.checkContinue(address, getState)) return;
    util.cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionBalances(address) {
  return async function(dispatch, getState) {
    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    const web3 = getState().network.web3;
    console.log('get balances');
    prediction.balance = await web3util.getBalanceInEther(address, web3);
    if (!util.checkContinue(address, getState)) return;
    const preview = getState().market.previews[address];
    if(preview) preview.balance = prediction.balance;
    prediction.positivePredicionBalance = +web3.fromWei(await contract.totals.call(true), 'ether').toNumber();
    if (!util.checkContinue(address, getState)) return;
    prediction.negativePredicionBalance = +web3.fromWei(await contract.totals.call(false), 'ether').toNumber();
    if (!util.checkContinue(address, getState)) return;
    util.cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}

export function updatePredictionState(address) {
  return async function(dispatch, getState) {

    const prediction = getState().prediction;
    const contract = getState().prediction.contract;
    const web3 = getState().network.web3;
    const player = getState().network.activeAccountAddress;
    console.log('get state (+prizes and fees)');

    prediction.outcome = await contract.outcome.call();
    if (!util.checkContinue(address, getState)) return;
    prediction.predictionState = (await contract.getState()).toNumber();
    if (!util.checkContinue(address, getState)) return;
    prediction.predictionStateStr = stateUtil.predictionStateToStr(prediction.predictionState);

    // Prizes and fees.
    prediction.estimatePrize = 0;
    prediction.estimateFees = 0;
    if (prediction.predictionState >= 2) {
      prediction.estimatePrize = +web3.fromWei(await contract.calculatePrize(prediction.outcome, {from: player}), 'ether').toNumber();
      if (!util.checkContinue(address, getState)) return;
      prediction.feesWithdrawn = await contract.feesWithdrawn.call();
      if(!prediction.feesWithdrawn) {
        prediction.estimateFees = +web3.fromWei(await contract.calculateFees(), 'ether').toNumber();
        if (!util.checkContinue(address, getState)) return;
      }
    }

    const preview = getState().market.previews[address];
    if(preview) preview.predictionState = prediction.predictionState;
    if(preview) preview.predictionStateStr = prediction.predictionStateStr;

    util.cachePrediction(address, prediction);
    dispatch({
      type: UPDATE_PREDICTION,
      payload: prediction
    });
  };
}