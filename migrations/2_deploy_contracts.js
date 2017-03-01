var Market = artifacts.require("./Market.sol");
var MarketFactory = artifacts.require("./MarketFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Market);
  deployer.deploy(MarketFactory);
};
