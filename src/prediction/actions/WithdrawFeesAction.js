import {
  updatePredictionBalances
} from '.';
import {USE_INJECTED_WEB3} from "../../constants";
import {setWaiting} from "../../network/actions/SetWaitingAction";

export function withdrawFees() {
  console.log('withdrawFees()');
  return async function(dispatch, getState) {
    const prediction = getState().prediction.contract;

    dispatch(setWaiting(true));

    // Claim
    console.log('withdrawing fees...', getState().network.activeAccountAddress);
    prediction.withdrawFees({
      from: getState().network.activeAccountAddress,
      gas: USE_INJECTED_WEB3 ? undefined : 4000000
    }).catch((err) => {
      console.log(err);
      dispatch(setWaiting(false));
    }).then(() => {
      dispatch(setWaiting(false));
      console.log('withdraw fees succesful!');

      // Invalidate prediction data.
      dispatch(updatePredictionBalances(prediction.address));
    });
  };
}
