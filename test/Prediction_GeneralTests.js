/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from './utils/TestUtil';
import * as web3Util from '../src/utils/Web3Util';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (General)', function(accounts) {

  before(() => {
    util.log('*** WARNING *** these tests will modify testrpc timestamps into the future');
  });

  it('should contain a valid text statement', async function() {

    const betEndTimestamp = web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5);
    const withdrawPeriod = dateUtil.daysToSeconds(10);
    util.log('betEndTimestamp:', betEndTimestamp);
    util.log('withdrawPeriod:', withdrawPeriod);
    const contract = await Prediction.new(
      "Bitcoin will reach $5000 in October 1.",
      betEndTimestamp,
      withdrawPeriod,
      2
    );
    util.log('contract created');

    const statement = await contract.statement.call();
    util.log('statement: ', statement);

    assert.notEqual(statement.length, 0, 'text is invalid');
  });

  it('should have a valid bet end date and withdrawal period', async function() {

    const betEndTimestamp = web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5);
    const withdrawPeriod = dateUtil.daysToSeconds(2);
    util.log('betEndTimestamp:', betEndTimestamp);
    util.log('withdrawPeriod:', withdrawPeriod);
    const contract = await Prediction.new(
      "Bitcoin will reach $5000 in October 1.",
      betEndTimestamp,
      withdrawPeriod,
      2
    );
    util.log('contract created');

    // Assumes that tests are ran immediately after contract creation.
    const nowTimestamp = web3Util.currentSimulatedDateUnix;
    const read_betEndTimestamp = (await contract.betEndTimestamp.call()).toNumber();
    util.log('read_betEndTimestamp: ', read_betEndTimestamp);
    const read_withdrawPeriod = (await contract.withdrawPeriod.call()).toNumber();
    util.log('read_withdrawPeriod: ', read_withdrawPeriod);

    assert.isAbove(read_betEndTimestamp, nowTimestamp, 'bet end date is invalid');
    assert.equal(read_betEndTimestamp, betEndTimestamp, 'bet end date is invalid');
    assert.equal(read_withdrawPeriod, withdrawPeriod, 'withdraw period is invalid');
  });

  it('should have a valid fee percentage');
  it('should reject invalid fee percetages');

  it('it should correctly track its state', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(2),
      2
    );
    util.log('contract created');

    // Initial state should be 0 'OPEN'.
    let state = (await contract.getState()).toNumber();
    util.log('time: ', await web3Util.getTimestamp(web3));
    util.log('state:', state);
    assert.equal(state, 0, 'incorrect state');

    util.log('skipping time');
    await web3Util.skipTime(dateUtil.daysToSeconds(1), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Should still be 0.
    state = (await contract.getState()).toNumber();
    util.log('time: ', await web3Util.getTimestamp(web3));
    util.log('state:', state);
    assert.equal(state, 0, 'incorrect state');

    // Skip until bets are closed.
    util.log('skipping betting period');
    await web3Util.skipTime(dateUtil.daysToSeconds(4), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // State should be 1 'CLOSED'.
    state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 1, 'incorrect state');

    util.log('resolving...');
    await contract.resolve(false, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    const withdrawTime = dateUtil.unixToDate((await contract.withdrawEndTimestamp.call()).toNumber());
    util.log('resolution timestamp: ', resolutionTime);
    util.log('withdraw timestamp: ', withdrawTime);

    // State should be 2 'RESOLVED'.
    state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 2, 'incorrect state');

    util.log('skipping period');
    await web3Util.skipTime(dateUtil.daysToSeconds(1), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Still Resolved
    state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 2, 'incorrect state');

    util.log('skipping withdrawal period');
    await web3Util.skipTime(dateUtil.daysToSeconds(1), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // State should be 3 'FINISHED'.
    state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 3, 'incorrect state');
  });

});
