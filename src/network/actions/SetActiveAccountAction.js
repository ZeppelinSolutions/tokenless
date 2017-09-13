import {updateDynamicPredictionData} from "../../prediction/actions/ConnectPredictionAction";

export const SET_ACTIVE_ACCOUNT_INDEX = 'network/SET_ACTIVE_ACCOUNT_INDEX';

export function setActiveAccountIndex(index) {
  console.log('setActiveAccountIndex()', index);
  return function(dispatch, getState) {

    dispatch({
      type: SET_ACTIVE_ACCOUNT_INDEX,
      payload: index
    });

    dispatch(updateDynamicPredictionData(getState().prediction.targetPredictionAddress));
  };
}
