const assertJump = require('./helpers/assertJump');

contract('MarketFactory', function(accounts) {

  //from https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6
  web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            var receipt = web3.eth.getTransactionReceipt(txnHash);
            if (receipt == null) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
            } else {
                resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };

    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
  };

  it("should create a Market for account[1]", async function() {
    let factory = await MarketFactory.new();
    await factory.createMarket("This market will close after 5 blocks.", 5, {from: accounts[1]});
    let marketAddress = await factory.marketContracts(0);
    let market = await Market.at(marketAddress);
    let owner = await market.owner();
    assert.equal(owner, accounts[1]);
  });

  it("bet for winning outcome is rewarded", async function() {
    let factory = await MarketFactory.new();
    await factory.createMarket("This market will close after 1 block.", 1, {from: accounts[0]});
    let marketAddress = await factory.marketContracts(0);
    let market = await Market.at(marketAddress);

    await market.bet(true, {from: accounts[1], value: web3.toWei('1','ether')});
    await market.bet(false, {from: accounts[2], value: web3.toWei('1','ether')});

    let txnHash = await market.checkDate();
    let receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    txnHash = await market.chooseOutcome(true);
    receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    await market.claimWinnings({from: accounts[1]});
    await market.claimWinnings({from: accounts[2]});

    let balanceBeforeWinner = web3.eth.getBalance(accounts[1]);
    let balanceBeforeLoser = web3.eth.getBalance(accounts[2]);

    txnHash = await market.withdrawPayments({from: accounts[1]});
    receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    try {
      await market.withdrawPayments({from: accounts[2]});
    } catch (error) {
      assertJump(error);
    }

    let balanceAfterWinner = web3.eth.getBalance(accounts[1]);
    let balanceAfterLoser = web3.eth.getBalance(accounts[2]);

    assert.isTrue(balanceAfterWinner > balanceBeforeWinner);
    assert.isTrue(balanceAfterLoser < balanceBeforeLoser);
  });

  it("bigger bet for winning outcome is rewarded more than smaller bet", async function() {
    let factory = await MarketFactory.new();
    await factory.createMarket("This market will close after 1 block.", 1, {from: accounts[0]});
    let marketAddress = await factory.marketContracts(0);
    let market = await Market.at(marketAddress);

    await market.bet(true, {from: accounts[1], value: web3.toWei('1','ether')});
    await market.bet(true, {from: accounts[3], value: web3.toWei('3','ether')});
    let txnHash = await market.bet(false, {from: accounts[2], value: web3.toWei('10','ether')});
    let receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    txnHash = await market.checkDate();
    receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    txnHash = await market.chooseOutcome(true);
    receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    await market.claimWinnings({from: accounts[1]});
    await market.claimWinnings({from: accounts[3]});
    await market.claimWinnings({from: accounts[2]});

    let balanceBeforeWinnerSmaller = web3.eth.getBalance(accounts[1]);
    let balanceBeforeWinnerBigger = web3.eth.getBalance(accounts[3]);
    let balanceBeforeLoser = web3.eth.getBalance(accounts[2]);

    txnHash = await market.withdrawPayments({from: accounts[1]});
    receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);
    txnHash = await market.withdrawPayments({from: accounts[3]});
    receiptMined = await web3.eth.getTransactionReceiptMined(txnHash);

    try {
      await market.withdrawPayments({from: accounts[2]});
    } catch (error) {
      assertJump(error);
    }

    let balanceAfterWinnerSmaller = web3.eth.getBalance(accounts[1]);
    let balanceAfterWinnerBigger = web3.eth.getBalance(accounts[3]);
    let balanceAfterLoser = web3.eth.getBalance(accounts[2]);

    assert.isTrue(balanceAfterWinnerBigger > balanceBeforeWinnerBigger, "1 - before: " + balanceBeforeWinnerBigger + " after: " + balanceAfterWinnerBigger);
    assert.isTrue(balanceAfterWinnerSmaller > balanceBeforeWinnerSmaller, "2- before: " + balanceBeforeWinnerSmaller + " after: " + balanceAfterWinnerSmaller);
    assert.isTrue(balanceAfterWinnerBigger > balanceAfterWinnerSmaller, "3");
    assert.isTrue(balanceAfterLoser < balanceBeforeLoser);
  });

});
