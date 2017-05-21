pragma solidity ^0.4.11;

import "./Market.sol";

contract MarketFactory {

  address[] public marketContracts;

  function MarketFactory() {

  }

  event MarketCreated(string text, uint blocks, address marketAddress);

  //Creates a Market contract, performs bookkeeping, transfers ownership of the contract to the sender, and returns the address
  function createMarket(string _text, uint _blocks) external returns (address) {
    uint endDate = block.number + _blocks;
    Market market = new Market(_text, endDate);
    marketContracts.push(market);
    market.transferOwnership(msg.sender);

    MarketCreated(_text, endDate, market);

    return market;
  }

  function getActiveMarkets() external returns (address[]) { }



}
