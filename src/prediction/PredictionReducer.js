import {
  CONNECT_PREDICTION,
  UPDATE_PREDICTION,
  RESET_PREDICTION
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false,
  targetPredictionAddress: undefined,
  /* additional prediction params are decomposed */
};

export default function(state = initialState, action) {
  // console.log('PredictionReducer', action);

  let prediction;

  switch(action.type) {

  case CONNECT_PREDICTION:
    prediction = action.payload;
    return {
      ...state,
      ...prediction,
      isConnected: true,
      targetPredictionAddress: prediction.address
    };

  case UPDATE_PREDICTION:
    prediction = action.payload;
    return {
      ...state,
      ...prediction
    };

  case RESET_PREDICTION:
    return initialState;

  default:
    return state;
  }
}
