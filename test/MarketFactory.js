'use strict';

var MarketFactory = artifacts.require('./MarketFactory.sol');
var Market = artifacts.require('./Market.sol');

const assertJump = require('./helpers/assertJump');

contract('MarketFactory', function(accounts) {

  it('should create a Market for account[1]', async function() {
    let factory = await MarketFactory.new();
    await factory.createMarket('This market will close after 5 blocks.', 5, {from: accounts[1]});
    let marketAddress = await factory.marketContracts(0);
    let market = await Market.at(marketAddress);
    let owner = await market.owner();
    assert.equal(owner, accounts[1]);
  });

  it('bet for winning outcome is rewarded', async function() {
    console.log('1');
    let factory = await MarketFactory.new();
    console.log('1.1');
    await factory.createMarket('This market will close after 5 blocks.', 5, {from: accounts[0]});
    console.log('1.2');
    let marketAddress = await factory.marketContracts(0);
    console.log('1.3');
    let market = await Market.at(marketAddress);
    console.log('1.4');

    await market.bet(true, {
      from: accounts[1],
      value: web3.toWei('1','ether')
    });
    console.log('2');
    await market.bet(false, {
      from: accounts[2],
      value: web3.toWei('1','ether')
    });
    console.log('3');



    let endDate = await market.endDate();

    while(web3.eth.blockNumber < endDate) {
      await web3.eth.sendTransaction({from: accounts[5], to: accounts[6], value: 10});
    }

    let txnHash = await market.checkDate();

    txnHash = await market.chooseOutcome(true);
    await market.claimWinnings({from: accounts[1]});
    console.log('4');
    await market.claimWinnings({from: accounts[2]});
    console.log('5');

    let balanceBeforeWinner = web3.eth.getBalance(accounts[1]);
    let balanceBeforeLoser = web3.eth.getBalance(accounts[2]);

    txnHash = await market.withdrawPayments({from: accounts[1]});

    try {
      await market.withdrawPayments({from: accounts[2]});
    } catch (error) {
      assertJump(error);
    }

    let balanceAfterWinner = web3.eth.getBalance(accounts[1]);
    let balanceAfterLoser = web3.eth.getBalance(accounts[2]);

    assert.isAbove(balanceAfterWinner.toNumber(), balanceBeforeWinner.toNumber(), balanceAfterWinner +' smaller than ' + balanceBeforeWinner);
    assert.isBelow(balanceAfterLoser.toNumber(), balanceBeforeLoser.toNumber());
  });

  it('bigger bet for winning outcome is rewarded more than smaller bet', async function() {
    let factory = await MarketFactory.new();
    await factory.createMarket('This market will close after 5 blocks.', 5, {from: accounts[0]});
    let marketAddress = await factory.marketContracts(0);
    let market = await Market.at(marketAddress);

    await market.bet(true, {from: accounts[1], value: web3.toWei('1','ether')});
    await market.bet(true, {from: accounts[3], value: web3.toWei('3','ether')});
    let txnHash = await market.bet(false, {from: accounts[2], value: web3.toWei('10','ether')});
    // receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    let endDate = await market.endDate();

    while(web3.eth.blockNumber < endDate) {
      await web3.eth.sendTransaction({from: accounts[5], to: accounts[6], value: 10});
    }

    txnHash = await market.checkDate();
    //receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    txnHash = await market.chooseOutcome(true);
    //receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    await market.claimWinnings({from: accounts[1]});
    await market.claimWinnings({from: accounts[3]});
    await market.claimWinnings({from: accounts[2]});

    let balanceBeforeWinnerSmaller = web3.eth.getBalance(accounts[1]);
    let balanceBeforeWinnerBigger = web3.eth.getBalance(accounts[3]);
    let balanceBeforeLoser = web3.eth.getBalance(accounts[2]);

    txnHash = await market.withdrawPayments({from: accounts[1]});
    //receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);
    txnHash = await market.withdrawPayments({from: accounts[3]});
    //receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    try {
      await market.withdrawPayments({from: accounts[2]});
    } catch (error) {
      assertJump(error);
    }

    let balanceAfterWinnerSmaller = web3.eth.getBalance(accounts[1]);
    let balanceAfterWinnerBigger = web3.eth.getBalance(accounts[3]);
    let balanceAfterLoser = web3.eth.getBalance(accounts[2]);

    assert.isAbove(balanceAfterWinnerBigger.toNumber(), balanceBeforeWinnerBigger.toNumber(), '1 - before: ' + balanceBeforeWinnerBigger + ' after: ' + balanceAfterWinnerBigger);
    assert.isAbove(balanceAfterWinnerSmaller.toNumber(), balanceBeforeWinnerSmaller.toNumber(), '2- before: ' + balanceBeforeWinnerSmaller + ' after: ' + balanceAfterWinnerSmaller);
    assert.isAbove(balanceAfterWinnerBigger.toNumber(), balanceAfterWinnerSmaller.toNumber(), '3');
    assert.isBelow(balanceAfterLoser.toNumber(), balanceBeforeLoser.toNumber());
  });

});
