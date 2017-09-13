/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from './utils/TestUtil';
import * as web3Util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (Resolve)', function(accounts) {

  before(() => {
    util.log('*** WARNING *** these tests will modify testrpc timestamps into the future');
  });

  it('should be resolvable only by the owner, and only after the closing date', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Try to resolve the game by a regular player, too early.
    util.log('early resolve 1...');
    await expectThrow(contract.resolve(true, {from: accounts[1]}));
    let state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 0, 'game was resolved by a regular player');

    // Try to resolve by the owner, too early.
    util.log('early resolve 2...');
    await expectThrow(contract.resolve(true, {from: accounts[0]}));
    state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 0, 'game was resolved by the owner before the closing date');

    // Make a bet.
    util.log('making bet');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });

    // Skip betting phase.
    util.log('skipping bet phase');
    await web3Util.skipTime(dateUtil.daysToSeconds(6), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));
    state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 1, 'state was supposed to be Closed (1)');

    // Resolve in the correct moment, by the owner.
    util.log('proper resolve');
    await contract.resolve(true, {from: accounts[0]});
    state = (await contract.getState()).toNumber();
    util.log('state:', state);
    assert.equal(state, 2, 'owner did not change state to Resolved(2)');
  });

});
