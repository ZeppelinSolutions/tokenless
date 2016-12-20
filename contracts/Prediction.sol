pragma solidity ^0.4.4;


import "zeppelin/contracts/Ownable.sol";

contract Fact is Ownable {
  
  string public text;
  mapping(bool => mapping(address => uint)) bets;
  mapping(bool => uint) totals;
  
  function Prediction(string _text) {
    text = _text;
  }

  // sending money to the contract equals a bet for true
  function () payable {
    bet(true)
  }

  // bet for the outcome of the fact
  function bet(bool prediction) payable {
    bets[prediction][msg.sender]
  }


}
