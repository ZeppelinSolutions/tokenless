/*eslint no-undef: "off"*/
const Prediction = artifacts.require('./Prediction.sol');
import * as util from './utils/TestUtil';
import * as web3Util from '../src/utils/Web3Util';
import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow';
import * as dateUtil from '../src/utils/DateUtil';

contract('Prediction (Withdraw)', function(accounts) {

  before(() => {
    util.log('*** WARNING *** these tests will modify testrpc timestamps into the future');
  });

  it('should allow winners to withdraw their prize after the prediction is resolved', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Place a few bets.
    util.log('placing bets...');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[2],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[3],
      value: web3.toWei(1, 'ether')
    });

    // Skip betting phase.
    util.log('skipping bets...');
    await web3Util.skipTime(dateUtil.daysToSeconds(5), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    util.log('resolving...');
    await contract.resolve(true, {from: accounts[0]});

    util.log('losers try to withdraw');
    await expectThrow(contract.withdrawPrize({from: accounts[2]}));
    await expectThrow(contract.withdrawPrize({from: accounts[3]}));

    // Winner try to withdraw.
    util.log('winner try to withdraw');
    const initPlayerBalance = await web3Util.getBalanceInEther(accounts[1], web3);
    util.log('initPlayerBalance', initPlayerBalance);
    const prize = web3.fromWei(await contract.calculatePrize(true, {from: accounts[1]}), 'ether').toNumber();
    util.log('expected prize:', prize);
    assert.notEqual(0, prize, 'prize should not be zero');
    await contract.withdrawPrize({from: accounts[1]});
    const newPlayerBalance = await web3Util.getBalanceInEther(accounts[1], web3);
    util.log('newPlayerBalance', newPlayerBalance);
    const expectedNewPlayerBalance = initPlayerBalance + prize;
    util.log('expectedNewPlayerBalance', expectedNewPlayerBalance);
    assert.approximately(newPlayerBalance, expectedNewPlayerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    util.log('winner try to withdraw again');
    await expectThrow(contract.withdrawPrize({from: accounts[1]}));
  });

  it('should allow the owner to withdraw his fees after the prediction is resolved', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    util.log('contract created');

    // Place bets.
    util.log('making bet');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[2],
      value: web3.toWei(1, 'ether')
    });

    // Skip until bets are closed.
    util.log('skipping betting period');
    await web3Util.skipTime(dateUtil.daysToSeconds(6), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Resolve the prediction.
    util.log('resolving...');
    await contract.resolve(false, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    util.log('resolution timestamp: ', resolutionTime);

    // Withdraw prizes.
    util.log('withdrawing prizes');
    const prize = web3.fromWei(await contract.calculatePrize(false, {from: accounts[2]}), 'ether').toNumber();
    util.log('expected prize:', prize);
    assert.notEqual(0, prize, 'prize should not be zero');
    await contract.withdrawPrize({from: accounts[2]});

    const initOwnerBalance = await web3Util.getBalanceInEther(accounts[0], web3);

    // Withdraw all fees.
    util.log('withdrawing fees');
    const fees = web3.fromWei(await contract.calculateFees({from: accounts[0]}), 'ether').toNumber();
    util.log('expected fees:', fees);
    assert.notEqual(0, fees, 'fees should not be zero');
    await contract.withdrawFees({from: accounts[0]});

    const newOwnerBalance = await web3Util.getBalanceInEther(accounts[0], web3);
    const expectedNewOwnerBalance = initOwnerBalance + fees;
    util.log('expectedNewOwnerBalance', expectedNewOwnerBalance);
    assert.approximately(newOwnerBalance, expectedNewOwnerBalance, 0.01, 'expected winner balance is incorrect');

    // Winners should not be able to withdraw twice.
    util.log('winner try to withdraw again');
    await expectThrow(contract.withdrawFees({from: accounts[0]}));
  });

  it('it should allow fee and prize withdrawals both in resolved and finished states', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(2),
      2
    );
    util.log('contract created');

    util.log('placing bet');
    await contract.bet(false, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });

    util.log('skipping betting period');
    await web3Util.skipTime(dateUtil.daysToSeconds(5), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    util.log('resolving...');
    await contract.resolve(false, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    util.log('resolution timestamp: ', resolutionTime);

    util.log('skipping withdraw period');
    await web3Util.skipTime(dateUtil.daysToSeconds(14), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    util.log('withdrawing prizes');
    let playerBalance0 = await web3Util.getBalanceInEther(accounts[1], web3);
    const prize = web3.fromWei(await contract.calculatePrize(false, {from: accounts[1]}), 'ether').toNumber();
    util.log('expected prize:', prize);
    assert.notEqual(0, prize, 'prize should not be zero');
    await contract.withdrawPrize({from: accounts[1]});
    let playerBalance1 = await web3Util.getBalanceInEther(accounts[1], web3);
    assert.approximately(playerBalance1, playerBalance0 + prize, 0.01, 'invalid winner balance');

    // Withdraw all fees.
    util.log('withdrawing fees');
    playerBalance0 = await web3Util.getBalanceInEther(accounts[0], web3);
    const fees = web3.fromWei(await contract.calculateFees({from: accounts[0]}), 'ether').toNumber();
    util.log('expected fees:', fees);
    assert.notEqual(0, fees, 'fees should not be zero');
    await contract.withdrawFees({from: accounts[0]});
    playerBalance1 = await web3Util.getBalanceInEther(accounts[0], web3);
    assert.approximately(playerBalance1, playerBalance0 + fees, 0.01, 'invalid owner balance');
  });

  it('it should allow an owner to purge the contract after the withdraw period expires', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(10),
      2
    );
    util.log('contract created');

    // Place bets.
    util.log('making bet');
    await contract.bet(true, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });
    await contract.bet(false, {
      from: accounts[2],
      value: web3.toWei(1, 'ether')
    });

    // Skip until bets are closed.
    util.log('skipping betting period');
    await web3Util.skipTime(dateUtil.daysToSeconds(6), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Resolve the prediction.
    util.log('resolving...');
    await contract.resolve(false, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    util.log('resolution timestamp: ', resolutionTime);

    // (dont withdraw prizes...)

    // Withdraw all fees.
    util.log('withdrawing fees');
    const fees = web3.fromWei(await contract.calculateFees({from: accounts[0]}), 'ether').toNumber();
    util.log('expected fees:', fees);
    assert.notEqual(0, fees, 'fees should not be zero');
    await contract.withdrawFees({from: accounts[0]});

    util.log('skipping withdrawal period');
    await web3Util.skipTime(dateUtil.daysToSeconds(10), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Purge contract.
    let contractBalance = await web3Util.getBalanceInEther(contract.address, web3);
    util.log('contractBalance:', contractBalance);
    util.log('purging...');
    await contract.purge({from: accounts[0]});
    contractBalance = await web3Util.getBalanceInEther(contract.address, web3);
    util.log('contractBalance:', contractBalance);
    assert.equal(contractBalance, 0, 'invalid owner balance');
  });

  it('it should allow fee and prize withdrawals both in resolved and finished states', async function() {
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(2),
      2
    );
    util.log('contract created');

    util.log('placing bet');
    await contract.bet(false, {
      from: accounts[1],
      value: web3.toWei(1, 'ether')
    });

    util.log('skipping betting period');
    await web3Util.skipTime(dateUtil.daysToSeconds(5), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    util.log('resolving...');
    await contract.resolve(false, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    util.log('resolution timestamp: ', resolutionTime);

    util.log('skipping withdraw period');
    await web3Util.skipTime(dateUtil.daysToSeconds(14), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Withdraw all fees.
    util.log('withdrawing fees');
    let playerBalance0 = await web3Util.getBalanceInEther(accounts[0], web3);
    const fees = web3.fromWei(await contract.calculateFees({from: accounts[0]}), 'ether').toNumber();
    util.log('expected fees:', fees);
    assert.notEqual(0, fees, 'fees should not be zero');
    await contract.withdrawFees({from: accounts[0]});
    let playerBalance1 = await web3Util.getBalanceInEther(accounts[0], web3);
    assert.approximately(playerBalance1, playerBalance0 + fees, 0.01, 'invalid owner balance');
  });

  it('it should verify that a lot of prize withdrawals correspond with calculated fees, resulting in a contract with zero balance', async function() {
    const feePercent = 2;
    const contract = await Prediction.new(
      'Bitcoin will reach $5000 in October 1.',
      web3Util.currentSimulatedDateUnix + dateUtil.daysToSeconds(5),
      dateUtil.daysToSeconds(2),
      feePercent
    );
    util.log('contract created');

    // Generate a bunch of random bets.
    const players = {};
    let posTotal = 0;
    let negTotal = 0;
    for(let i = 0; i < 100; i++) {

      // Randomize values.
      const playerIdx = util.getRandomInt(1, 10); // not the owner
      const playerAddr = accounts[playerIdx];
      const prediction = Math.random() > 0.5;
      const bet = util.getRandomFloat(1, 5);
      util.log(i, 'placing randomized bet:', playerIdx, prediction, bet);

      // Place bet.
      await contract.bet(prediction, {
        from: playerAddr,
        value: web3.toWei(bet, 'ether')
      });

      // Store locally for later accounting.
      const player = players[playerIdx + ''] || {};
      if(prediction) {
        player.posBalance = player.posBalance ? player.posBalance + bet : bet;
        posTotal += bet;
      }
      else {
        player.negBalance = player.negBalance ? player.negBalance + bet : bet;
        negTotal += bet;
      }
      players[playerIdx + ''] = player;
      // util.log('  player balances:', player.posBalance, player.negBalance);
    }
    util.log('posTotal:', posTotal);
    util.log('negTotal:', negTotal);
    const total = posTotal + negTotal;
    util.log('total:', total);
    // util.log('players:', JSON.stringify(players));

    // TODO: shouldnt these be equal instead of approx?
    // Review all usage of 'approximately' here.

    // Verify pot balances..
    await web3Util.delay(500);
    const positivePredicionBalance = +web3.fromWei((await contract.totals.call(true)).toNumber());
    const negativePredicionBalance = +web3.fromWei((await contract.totals.call(false)).toNumber());
    util.log('positivePredicionBalance', positivePredicionBalance);
    util.log('negativePredicionBalance', negativePredicionBalance);
    assert.approximately(positivePredicionBalance, posTotal, 0.01, 'incorrect prediction pos pot');
    assert.approximately(negativePredicionBalance, negTotal, 0.01, 'incorrect prediction neg pot');

    // Verify contract balance.
    let contractBalance = await web3Util.getBalanceInEther(contract.address, web3);
    util.log('contractBalance', contractBalance);
    assert.approximately(contractBalance, total, 0.01, 'incorrect prediction balance');

    // Skip ahead.
    util.log('skipping betting period');
    await web3Util.skipTime(dateUtil.daysToSeconds(5), web3);
    util.log('time: ', await web3Util.getTimestamp(web3));

    // Resolve the prediction.
    util.log('resolving...');
    const outcome = Math.random() > 0.5;
    util.log('outcome:', outcome);
    await contract.resolve(outcome, {from: accounts[0]});
    const resolutionTime = dateUtil.unixToDate((await contract.resolutionTimestamp.call()).toNumber());
    util.log('resolution timestamp: ', resolutionTime);

    // Have all players withdraw their prizes.
    util.log('withdrawing prizes...');
    for(let i = 1; i < 10; i++) {

      const player = players[i + ''];
      if(!player) return;
      util.log('>> withdrawing player', i);
      util.log('  player balances:', player.posBalance, player.negBalance);

      // Calculate expected prize locally.
      const balance = outcome ? player.posBalance : player.negBalance;
      if(!balance) continue; // No prizes for this guy.
      const winBalance = outcome ? posTotal : negTotal;
      const loserBalance = !outcome ? posTotal : negTotal;
      const winPercent = balance / winBalance;
      util.log('  win percent:', winPercent);
      const loserChunk = winPercent * loserBalance;
      util.log('  chunk:', loserChunk);
      const expectedPrize = (balance + loserChunk) * (1 - feePercent / 100);
      util.log('  expected prize:', expectedPrize);

      // Compare with real prize.
      const prize = web3.fromWei(await contract.calculatePrize(outcome, {from: accounts[i]}), 'ether').toNumber();
      util.log('  real prize:', prize);
      assert.approximately(expectedPrize, prize, 0.01, 'prize mismatch');

      // Withdraw prize.
      await contract.withdrawPrize({from: accounts[i]});
      util.log('  withdrawn');
    }

    // Verify that whatever is left over corresponds to the owners fees.
    const expectedFees = total * feePercent / 100;
    util.log('expected fees:', expectedFees);
    const fees = web3.fromWei(await contract.calculateFees({from: accounts[0]}), 'ether').toNumber();
    util.log('real fees:', fees);
    assert.approximately(expectedFees, fees, 0.01, 'fee mismatch');
    contractBalance = await web3Util.getBalanceInEther(contract.address, web3);
    util.log('contractBalance', contractBalance);
    assert.approximately(contractBalance, fees, 0.01, 'balance mismatch');

    // Finally, withdraw fees and verify that balance is 0.
    util.log('>>>> withdrawing fees...');
    await contract.withdrawFees({from: accounts[0]});
    contractBalance = await web3Util.getBalanceInEther(contract.address, web3);
    util.log('contractBalance', contractBalance);
    assert.approximately(contractBalance, 0, 0.001, 'balance mismatch');
  });
});
