window.onload=function(e){checkweb3();}

//Order of this array must match order of enum State in Market.sol
var stateStrings = ["Open", "Closed", "Resolved", "Finished"];
var outcomeStrings = ["False", "True", "None"];

var selectedwallet;
function checkWallet() {
   accounts = web3.eth.accounts;
   if(accounts.length>0) {
    if($("#wallets").html()=="") {
            for(var i=0;i<accounts.length;i++)
               $("#wallets").append('<option value="'+i+'">'+accounts[i]+'</option>');
    }
    selectedwallet=$("#wallets").val();
    web3.eth.getBalance(web3.eth.accounts[selectedwallet], function(err,data) {
       if(err) {
         console.log("Error: "+err);
       } else {
         var temp=""+web3.fromWei(data, "ether");
         $("#balance").text(temp.substring(0, 8)+" ETH");
       }
    });
   } else {
    $("#noWalletAlert").show();
    $("#my-coins").hide();
  }

  $('#wallets').change(function() {
    selectedwallet=$("#wallets").val();
    displayBalance();
    if($('#marketDetails').is(':visible'))
      loadDetails(market.address);
  });
}

function displayBalance() {
  web3.eth.getBalance(web3.eth.accounts[selectedwallet], function(err,data) {
     if(err) {
       console.log("Error: "+err);
     } else {
       var temp=""+web3.fromWei(data, "ether");
       $("#balance").text(temp.substring(0, 8)+" ETH");
     }
  });
}

function checkweb3() {


    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {

      // Use Mist/MetaMask's provider
      web3 = new Web3(web3.currentProvider);
      checkWallet();
      console.log("starting...");
      start();

    } else if (typeof Web3 !== 'undefined') {

      // If there isn't then set a provider
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      setTimeout(function(){location.reload(); }, 2000);

    } else if(typeof web3 == 'undefined' && typeof Web3 == 'undefined') {

      alert("Please Access Using MIST Browser Or Metamask");
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    }


   // If no accounts are present, show the floating baloon
   if ((!web3.eth.accounts || (web3.eth.accounts.length == 0))) {
   alert("Please Enable your Wallet");
   }else{}


}

function start() {
  MarketFactory.deployed().then(function(_factory) {
    factory = _factory;
    loadMarkets();
    watchMarketFactory();

  });
}

function view(id) {
  if(id=="marketsList") {
    $('#createMarketForm').hide();
    $('#marketsList').show();
    $('#marketDetails').hide();
  } else {
    $('#marketsList').hide();
    $('#createMarketForm').show();
  }
}

function createMarket() {
  var name = $('#name').val();
  var blocks = $('#blocks').val();
  factory.createMarket(name, blocks, {from: web3.eth.accounts[selectedwallet], gas: 1000000});
}

var market, state;
var bets = [];
var betEvent;
var totals = [];
var walletTotals = [];

function loadDetails(address) {
  $('#marketsList').hide();

  if ( ! $.fn.DataTable.isDataTable( '#betTable' ) ) {
    $('#betTable').DataTable({
      "columns": [
        { title: "Address"},
        { title: "Prediction"},
        { title: "Amount"}
      ]
    });
  }

  if(betEvent) {
    betEvent.stopWatching();
  }
  bets = [];
  $('#betTable').dataTable().fnClearTable();

  Market.at(address).then(function(_market) {
    market = _market;
    return market.state();
  })
  .then(function(_state) {
    state = stateStrings[_state];
    $('#state').text(state);

    totals[true] = 0;
    totals[false] = 0;
    walletTotals[true] = 0;
    walletTotals[false] = 0;

    $('#betForm').hide();
    $('#outcomeForm').hide();
    $('#withdrawForm').hide();

    betEvent = market.Bet({},{fromBlock: 0, toBlock: 'latest'});
    betEvent.watch(function(error, result) {
      if(error) {
        console.log(error);
      }
      console.log("BetEvent caught");
      if(result.args.value) {
        totals[result.args.prediction] += Number(web3.fromWei(result.args.value.toNumber(), 'ether'));
        if(result.args.from == web3.eth.accounts[selectedwallet]) {
          walletTotals[result.args.prediction] += Number(web3.fromWei(result.args.value.toNumber(), 'ether'));
        }
        bets.push([
          result.args.from,
          result.args.prediction,
          web3.fromWei(result.args.value.toNumber(), 'ether')
        ]);
        updateBetTable();
        displayBalance();
      }
    });

    if(state == "Open") {
      $('#betForm').show();
    } else if (state == "Closed") {
      //if owner, show outcome picker
      market.owner()
      .then(function(owner) {
        if(owner == web3.eth.accounts[selectedwallet]) {
          $('#outcomeForm').show();
        }
      })
    } else if (state == "Resolved") {
      var resolvedEvent = market.Resolved({},{fromBlock: 0, toBlock: 'latest'});
      resolvedEvent.watch(function(error, result) {
        if(error) {
          console.log(error);
        }
        console.log("ResolveEvent caught");
        if(result.args.outcome) {
          $('#actualOutcome').text(result.args.outcome);
          $('#withdrawForm').show();
        }
      });

    }

    return market.text();
  })
  .then(function(text) {
    $('#title').text(text);
    $('#marketDetails').show();
  });

}

function updateBetTable() {
  $('#trueTotals').text(totals[true]);
  $('#falseTotals').text(totals[false]);
  $('#yourBetsTrue').text(walletTotals[true]);
  $('#yourBetsFalse').text(walletTotals[false]);
  $('#betTable').dataTable().fnClearTable();
  $('#betTable').dataTable().fnAddData(bets);
}

function bet() {
  var prediction = $('#outcome').val();
  prediction = (prediction == "true") ? true : false;
  var amount = $('#amount').val();
  if(amount <= 0)
    return;
  market.bet(prediction, {from: web3.eth.accounts[selectedwallet], value: web3.toWei(amount,'ether')});

  //not ideal place to check date, should probably be done serverside
  market.checkDate({from: web3.eth.accounts[selectedwallet]});
};

function resolve() {
  var outcome;
  market.owner()
  .then(function(owner) {
    if(owner == web3.eth.accounts[selectedwallet]) {
      outcome = $('#resolveOutcome').val();
      outcome = (outcome == "true") ? true : false;
      return true;
    }
    return false;
  })
  .then(function(isOwner) {
    if(isOwner) {
      market.chooseOutcome(outcome, {from: web3.eth.accounts[selectedwallet], gas: 1000000});
    }
  })
  .then(function() {
    loadDetails(market.address);
  });
}

function claimWinnings() {
  market.claimWinnings({from: web3.eth.accounts[selectedwallet]});
}

function withdraw() {
  market.withdrawPayments({from: web3.eth.accounts[selectedwallet]})
  .then(function() {
    displayBalance();
  });
}

var accounts;
var account;
var factory;
var openMarketAddresses = [];

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function getMarketFactory() {
  MarketFactory.deployed().then(function(_factory) {
    factory = _factory;
  });
}

var lastLoggedEvent;

var marketEvent;

function watchMarketFactory() {
  marketEvent = factory.MarketCreated({},{fromBlock: 0, toBlock: 'latest'});
  marketEvent.watch(function(error, result) {
    if(error) {
      console.log(error);
    }
    console.log("Event caught");
    if(result.args.marketAddress) {
      openMarketAddresses.push([
        result.args.text,
        result.args.blocks.toNumber(),
        '<input type="button" onClick="loadDetails(this.dataset.address)" value="View Market" data-address="' + result.args.marketAddress + '"/>',
        result.args.marketAddress
      ]);
      updateOpenTable();
    }
  });

}

function updateOpenTable() {
  $('#openMarkets').dataTable().fnClearTable();
  $('#openMarkets').dataTable().fnAddData(openMarketAddresses);
}

function loadMarkets() {

  $('#openMarkets').DataTable({
    "data": openMarketAddresses,
    "columns": [
      { title: "Title"},
      { title: "Closes at Block"},
      { title: "Address"}
    ]
  });

}
