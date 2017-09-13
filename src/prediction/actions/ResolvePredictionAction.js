import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";
import {
  updatePredictionState
} from ".";

export function resolvePrediction(outcome) {
  return async function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    dispatch(setWaiting(true));

    // Resolve
    console.log('resolving prediction with outcome:', outcome);
    prediction.resolve(outcome, {
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      console.log('contract resolved!');
      dispatch(setWaiting(false));

      // Invalidate prediction data.
      dispatch(updatePredictionState(prediction.address));
    });
  };
}
