/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from './utils/TestUtil';
import * as web3Util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (Bets)', function(accounts) {

  it('should accepts funds via bets, increasing its balance', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(1),
      2
    );

    const userAddress = accounts[1];
    const initialUserBalance = await web3Util.getBalanceInEther(userAddress, web3);
    const betValueEth = 1;
    await contract.bet(true, {
      from: userAddress,
      value: web3.toWei(betValueEth, 'ether')
    });

    const newUserBalance = await web3Util.getBalanceInEther(userAddress, web3);
    util.log('newUserBalance', newUserBalance);
    const newContractBalance = await web3Util.getBalanceInEther(contract.address, web3);
    util.log('newContractBalance', newContractBalance);

    assert.approximately(initialUserBalance - betValueEth, newUserBalance, 0.01, 'user balance was not deduced');
    assert.equal(1, newContractBalance, 'contract balance was not increased');
  });

  it('should not allow owners to bet, returning sent funds', async function () {

    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );

    const userAddress = accounts[0];
    const initialUserBalance = await web3Util.getBalanceInEther(userAddress, web3);
    util.log('initialUserBalance', initialUserBalance);
    await expectThrow(contract.bet(true, {
      from: userAddress,
      value: web3.toWei(1, 'ether'),
      gas: 30000
    }));

    const newUserBalance = await web3Util.getBalanceInEther(userAddress, web3);
    util.log('newUserBalance', newUserBalance);
    const newContractBalance = await web3Util.getBalanceInEther(contract.address, web3);
    util.log('newContractBalance', newContractBalance);

    assert.approximately(newUserBalance, initialUserBalance, 0.01, 'user balance was deduced');
    assert.equal(0, newContractBalance, 'contract balance was altered');

  });

  it('should keep track of a users positive and negative bet balances', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );

    // Expect empty positive and negative balances.
    util.log('checking that balances are empty');
    let userNullBalance = web3.fromWei(await contract.getUserBalance(true, {
      from: accounts[1]
    }), 'ether').toNumber();
    util.log('user 1 null pos balance: ', userNullBalance);
    assert.equal(0, userNullBalance, 'user balance supposed to be 0');
    userNullBalance = web3.fromWei(await contract.getUserBalance(false, {
      from: accounts[1]
    }), 'ether').toNumber();
    util.log('user 1 null neg balance: ', userNullBalance);
    assert.equal(0, userNullBalance, 'user balance supposed to be 0');

    // Place bets on yes/no.
    util.log('placing bets...');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[1],
      value: web3.toWei(2, 'ether')
    });

    // Check balances.
    const userPosBalance = web3.fromWei(await contract.getUserBalance(true, {
      from: accounts[1]
    }), 'ether').toNumber();
    util.log('user 1 pos balance: ', userPosBalance);
    assert.equal(1, userPosBalance, 'user balance was not tracked');
    const userNegBalance = web3.fromWei(await contract.getUserBalance(false, {
      from: accounts[1]
    }), 'ether').toNumber();
    util.log('user 1 neg balance: ', userNegBalance);
    assert.equal(2, userNegBalance, 'user balance was not tracked');
  });

  it('should keep track of and expose pot totals', async function() {

    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );

    let i;
    for(i = 0; i < 5; i++) {
      await contract.bet(true, {
        from: accounts[1],
        value: web3.toWei(1, 'ether')
      });
      util.log('positive bet');
    }
    for(i = 0; i < 3; i++) {
      await contract.bet(false, {
        from: accounts[1],
        value: web3.toWei(1, 'ether')
      });
      util.log('negative bet');
    }

    await web3Util.delay(500);
    const positivePredicionBalance = web3.fromWei((await contract.totals.call(true)).toNumber());
    const negativePredicionBalance = web3.fromWei((await contract.totals.call(false)).toNumber());
    util.log('positivePredicionBalance', positivePredicionBalance);
    util.log('negativePredicionBalance', negativePredicionBalance);

    assert.equal(positivePredicionBalance, 5, 'incorrect prediction balance');
    assert.equal(negativePredicionBalance, 3, 'incorrect prediction balance');
  });

  it('should correctly keep track of totals for a very large number of randomized bets');
});
