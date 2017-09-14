/*eslint no-undef: "off"*/
const PredictionMarket = artifacts.require('./PredictionMarket.sol');
const Prediction = artifacts.require('./Prediction.sol');
import * as dateUtil from '../src/utils/DateUtil';
import * as util from './utils/TestUtil';
import * as web3Util from '../src/utils/Web3Util';

contract('PredictionMarket (General)', function(accounts) {

  before(() => {
  });

  it('should be able to create a prediction with transferred ownership', async function() {
    const market = await PredictionMarket.new(
      dateUtil.daysToSeconds(5),
      2,
      {
        from: accounts[0]
      }
    );
    util.log('prediction address:', market.address);

    // Create prediction.
    const predictionStatement = 'The market contract will work.';
    const creationTransaction = await market.createPrediction(
      predictionStatement,
      web3Util.getCurrentTime(web3) + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      {
        from: accounts[0]
      }
    );
    util.log('creation transaction:', creationTransaction);

    // Prediction address is obtained by analysing the transaction logs.
    // Part of the logs is an event contained in the transaction.
    const creationEventArgs = creationTransaction.logs[0].args;
    const predictionAddress = creationEventArgs.predictionAddress;
    util.log('predictionAddress:', predictionAddress);

    // Retrieve prediction.
    const prediction = await Prediction.at(predictionAddress);
    const statement = await prediction.statement.call();
    util.log('prediction statement: ', statement);
    assert.notEqual(statement.length, 0, 'text is invalid');
    assert.equal(statement, predictionStatement, 'statement doesnt match');

    // Verify owner.
    const predictionOwner = await prediction.owner.call();
    util.log('prediction owned by: ', predictionOwner);
    assert.notEqual(predictionOwner, 0, 'invalid owner');
    assert.notEqual(predictionOwner, prediction.address, 'invalid owner');
  });

  it('should keep track of multiple predictions', async function() {

    const market = await PredictionMarket.new(
      dateUtil.daysToSeconds(5),
      2
    );

    // Create a few predictions and recall their addresse.
    const localAddresses = [];
    localAddresses.push((await market.createPrediction(
      'Prediction 0.',
      web3Util.getCurrentTime(web3) + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      {from: accounts[0]}
    )).logs[0].args.predictionAddress);
    localAddresses.push((await market.createPrediction(
      'Prediction 1.',
      web3Util.getCurrentTime(web3) + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      {from: accounts[0]}
    )).logs[0].args.predictionAddress);
    localAddresses.push((await market.createPrediction(
      'Prediction 2.',
      web3Util.getCurrentTime(web3) + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      {from: accounts[0]}
    )).logs[0].args.predictionAddress);
    util.log('localAddresses', localAddresses);

    // Ask the prediction for its addresses.
    const remoteAddresses = await market.getPredictions();
    util.log('remoteAddresses', remoteAddresses);

    assert.equal(localAddresses.length, remoteAddresses.length, 'num addresses mismatch');
  });
});
