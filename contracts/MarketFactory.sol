pragma solidity ^0.4.4;

import "./Market.sol";

contract MarketFactory {

  address[] marketContracts;

  //Creates a Market contract, performs bookkeeping, transfers ownership of the contract to the sender, and returns the address
  function createMarket(string _text) external returns (address) {
    address marketAddress = new Market(_text);
    marketContracts.push(marketAddress);

    Market market = new Market(marketAddress);
    market.transferOwnership(msg.sender);

    return marketAddress;
  }

}
