pragma solidity ^0.4.11;

import './Prediction.sol';

contract PredictionMarket {

  address[] predictions;

  function getPredictions() constant returns (address[]) {
    return predictions;
  }
  
  // --------------------------------------------------
  // Init
  // --------------------------------------------------
  
  uint public minWithdrawPeriod;
  uint public feePercent;

  function PredictionMarket(uint _minWithdrawPeriod, uint _feePercent) {
    minWithdrawPeriod = _minWithdrawPeriod;
    feePercent = _feePercent;
  }

  // ---------------------
  // Creation
  // ---------------------

  event PredictionCreatedEvent(Prediction predictionAddress);

  function createPrediction(string statement, uint betEndTimestamp, uint withdrawPeriod) {

      // Contain withdraw peried.
      if(withdrawPeriod < minWithdrawPeriod) withdrawPeriod = minWithdrawPeriod;

      // Crate prediction and store address.
      Prediction prediction = new Prediction(statement, betEndTimestamp, withdrawPeriod, feePercent);
      predictions.push(prediction);

      // Transfer ownership to whoever called for
      // the creation of the prediction (i.e. not this prediction).
      prediction.transferOwnership(msg.sender);

      PredictionCreatedEvent(prediction);
  }
}

















