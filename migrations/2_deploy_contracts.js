var Market = artifacts.require("./Market.sol");
var MarketFactory = artifacts.require("./MarketFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Market); // TODO: Do we need to actually deploy a Market? Don't we need just the factory?
  deployer.deploy(MarketFactory);
};
