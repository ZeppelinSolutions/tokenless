import {setWaiting} from "../../network/actions/SetWaitingAction";
import {USE_INJECTED_WEB3} from "../../constants";
import {updateDynamicPredictionData} from "./ConnectPredictionAction";

export function purgePrediction() {
  console.log('purgePrediction()');
  return function(dispatch, getState) {

    const prediction = getState().prediction.contract;

    dispatch(setWaiting(true));

    // Resolve
    prediction.purge({
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      console.log('contract purged!');
      dispatch(setWaiting(false));

      // Invalidate prediction data.
      dispatch(updateDynamicPredictionData());
    });
  };
}