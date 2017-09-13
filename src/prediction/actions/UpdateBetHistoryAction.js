import * as util from './utils/PredictionUtil';
import {UPDATE_PREDICTION} from "./ConnectPredictionAction";
import _ from 'lodash';
import {HISTORY_CHECK_BATCH} from "../../constants";

export function updateBetHistory(address) {
  console.log('updateBetHistory()', address);
  return async function(dispatch, getState) {

    const prediction = getState().prediction;

    const currentBlock = getState().network.blockNumber;
    if (!util.checkContinue(address, getState)) return;
    prediction.lastBlockCheckpoint = currentBlock;

    checkNext(prediction, getState, dispatch);
  };
}

async function checkNext(prediction, getState, dispatch) {
  console.log('history - checkNext()');
  updateAcountedBalances(prediction);

  if(!shouldContinueSearching(prediction)) {
    if(prediction.betHistory === undefined) prediction.betHistory = [];
    return;
  }

  console.log('should check');

  // Query block batch.
  const fromBlock = Math.max(prediction.lastBlockCheckpoint - HISTORY_CHECK_BATCH, 0);
  const toBlock = prediction.lastBlockCheckpoint;
  if(isNaN(fromBlock) || isNaN(toBlock)) return;
  getBetsInBlockRange(fromBlock, toBlock, prediction, getState)
    .then((foundBets) => {

      if (!util.checkContinue(prediction.address, getState)) return;
      // console.log('found bets:', foundBets);

      // Sweep found bets and update cached history if any is new.
      if(prediction.betHistory === undefined) prediction.betHistory = [];
      // console.log('existing bets:', prediction.betHistory);
      const diff = _.differenceBy(foundBets, prediction.betHistory, 'tx');
      // console.log('history diff:', diff);
      if(diff.length > 0) {

        // Include new found bets.
        prediction.betHistory = diff.concat(prediction.betHistory);
        // console.log('consolidated history:', prediction.betHistory);

        updateAcountedBalances(prediction);
      }

      // Cache results.
      prediction.lastBlockCheckpoint = fromBlock;
      util.cachePrediction(prediction.address, prediction);

      // Update state.
      dispatch({
        type: UPDATE_PREDICTION,
        payload: prediction
      });

      // Next batch.
      if (!util.checkContinue(prediction.address, getState)) return;
      checkNext(prediction, getState, dispatch);
    })
    .catch();
}

function updateAcountedBalances(prediction) {
  if(!prediction.betHistory) return;
  let acumPos = 0;
  let acumNeg = 0;
  for(let i = 0; i < prediction.betHistory.length; i++) {
    const bet = prediction.betHistory[i];
    if(bet.prediction) acumPos += bet.value;
    else acumNeg += bet.value;
  }
  // console.log('update accoutned balances:', acumPos, acumNeg);
  prediction.historyAccountedPositiveBetBalance = acumPos;
  prediction.historyAccountedNegativeBetBalance = acumNeg;
}

function shouldContinueSearching(prediction) {
  if(prediction.positivePredicionBalance === 0 && prediction.negativePredicionBalance === 0) {
    console.log('0 balances');
    return false;
  }
  if(prediction.lastBlockCheckpoint === 0) {
    console.log('reached 0');
    return false;
  }
  if(prediction.historyAccountedPositiveBetBalance === undefined &&
     prediction.positivePredicionBalance !== undefined &&
     prediction.positivePredicionBalance !== 0) {
    console.log('no accounted pos balance');
    return true;
  }
  if(prediction.historyAccountedNegativeBetBalance === undefined &&
     prediction.negativePredicionBalance !== undefined &&
     prediction.negativePredicionBalance !== 0) {
    console.log('no accounted neg balance');
    return true;
  }
  if(prediction.historyAccountedPositiveBetBalance < prediction.positivePredicionBalance) {
    console.log('pos balance not reached');
    return true;
  }
  if(prediction.historyAccountedNegativeBetBalance < prediction.negativePredicionBalance) {
    console.log('neg balance not reached');
    return true;
  }
  return false;
}

function getBetsInBlockRange(fromBlock, toBlock, prediction, getState) {
  console.log('history - getBetsInBlockRange()', fromBlock, toBlock);
  return new Promise((resolve, reject) => {

    const bets = [];

    const contract = prediction.contract;
    const web3 = getState().network.web3;

    // Query Web3 event.
    const event = contract.BetEvent({}, {fromBlock, toBlock});
    event.get((err, res) => {
      // console.log('BetEvent', err, res);
      if (!util.checkContinue(prediction.address, getState)) {
        reject();
        return;
      }

      // Record found bets.
      if (!err) {
        // console.log('res', res);
        for (let i = 0; i < res.length; i++) {
          console.log('update bet history item');
          const item = res[i];
          const data = item.args;
          bets.splice(0, 0, {
            tx: item.transactionHash,
            from: data.from,
            prediction: data.prediction,
            value: +web3.fromWei(data.value, 'ether').toNumber()
          });
        }
        resolve(bets);
      }
      else {
        console.log('err', err);
        reject();
      }
    });
  });
}