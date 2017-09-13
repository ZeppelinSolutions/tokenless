/*eslint no-undef: "off"*/
const PredictionMarket = artifacts.require("./PredictionMarket.sol");

module.exports = function(deployer) {
  deployer.deploy(
    PredictionMarket,
    60, /* minWithdrawEndTimestampDelta */
    2 /* feePercent */
  );
};
