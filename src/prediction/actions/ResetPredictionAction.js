export const RESET_PREDICTION = 'prediction/RESET_PREDICTION';

export function resetPrediction() {
  console.log('resetPrediction()');
  return function(dispatch, getState) {
    dispatch({
      type: RESET_PREDICTION,
    });
  };
}
