import { push } from 'react-router-redux';
import * as dateUtil from '../../utils/DateUtil';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";
import {getPredictionPreview} from "./GetPredictionPreviewAction";
import {updateDynamicMarketData} from "./ConnectMarketAction";

export function createPrediction(statement, betEndDate, withdrawPeriod) {
  console.log('createPrediction()', statement, betEndDate, withdrawPeriod);
  return async function(dispatch, getState) {

    const market = getState().market.contract;
    const acct = getState().network.activeAccountAddress;
    console.log('acct:', acct);

    dispatch(setWaiting(true));

    // Send transaction.
    const unixBet = dateUtil.dateToUnix(betEndDate);
    console.log('creating prediction:', statement, unixBet, withdrawPeriod);
    market.createPrediction(
      statement,
      unixBet,
      withdrawPeriod,
      {
        from: acct,
        gas: USE_INJECTED_WEB3 ? undefined : 4000000
      }
    ).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then((result) => {
      console.log('prediction created');
      const predictionAddress = result.logs[0].args.predictionAddress;
      dispatch(push(`/prediction/${predictionAddress}`));
      dispatch(setWaiting(false));
      dispatch(updateDynamicMarketData());
      dispatch(getPredictionPreview(predictionAddress));
    });
  };
}
