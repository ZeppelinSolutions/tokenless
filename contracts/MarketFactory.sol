pragma solidity ^0.4.4;

import "./Market.sol";

contract MarketFactory {

  address[] public marketContracts;

  function MarketFactory() {

  }

  //Creates a Market contract, performs bookkeeping, transfers ownership of the contract to the sender, and returns the address
  function createMarket(string _text, uint _blocks) external returns (address) {
    Market market = new Market(_text, block.number + _blocks);
    marketContracts.push(market);
    market.transferOwnership(msg.sender);

    return market;
  }

  function getActiveMarkets() external returns (address[]) { }



}
