/*eslint no-undef: "off"*/
/*eslint no-unused-vars: "off"*/

const TruffleContract = require('truffle-contract');
const MarketArtifacts = require('../../build/contracts/PredictionMarket.json');
const PredictionArtifacts = require('../../build/contracts/Prediction.json');
const util = require('../../src/utils/Web3Util');
const constants = require('../../src/constants');
const dateUtil = require('../../src/utils/DateUtil');

const addr0 = '0xdf08f82de32b8d460adbe8d72043e3a7e25a3b39';

module.exports = async function(callback) {

  util.log('Running create_predictions...');

  // Retrieve deployed prediction prediction.
  const Market = TruffleContract(MarketArtifacts);
  Market.setProvider(web3.currentProvider);
  const market = await Market.at(constants.MARKET_ADDRESS['testrpc']);
  util.log('market retrieved');

  // Create a bunch of predictions.
  // createDeterministicPredictions(market);
  createRandomPredictions(500, market);

  callback();
};

// ---------------------
// DETERMINISTIC
// ---------------------

async function createDeterministicPredictions(market) {

  util.log('createDeterministicPredictions()');
  const predictions = [
    {statement: 'Whrachikov will win the election.',
      duration: 1},
    {statement: 'The Mayans will return to earth in 2018',
      duration: 10},
    {statement: 'Bitcoin will be worth $5000 by October 2017',
      duration: 100},
    {statement: 'Bitcoin will fork again in 2017',
      duration: 1000},
  ];
  for(let i = 0; i < predictions.length; i++) {

    // Create prediction.
    const prediction = predictions[i];
    const creationTransaction = await market.createPrediction(
      prediction.statement,
      dateUtil.dateToUnix(new Date()) + dateUtil.daysToSeconds(prediction.duration),
      dateUtil.dateToUnix(new Date()) + dateUtil.daysToSeconds(prediction.duration + 5),
      {
        from: addr0,
        gas: 4000000
      }
    );

    // Retrieve prediction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const predictionAddress = creationEventArgs.predictionAddress;
    util.log('prediction created:', predictionAddress);
  }
}

// ---------------------
// RANDOM
// ---------------------

async function createRandomPredictions(num, market) {
  util.log('createRandomPredictions()', num);
  for(let i = 0; i < num; i++) {

    const duration = Math.floor(1000 * Math.random()) + 10;

    // Create prediction.
    const creationTransaction = await market.createPrediction(
      "Random prediction " + i,
      dateUtil.dateToUnix(new Date()) + duration,
      dateUtil.dateToUnix(new Date()) + duration + 200,
      {
        from: addr0,
        gas: 4000000
      }
    );

    // Retrieve prediction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const predictionAddress = creationEventArgs.predictionAddress;
    util.log('prediction created:', predictionAddress);
  }
}
