pragma solidity ^0.4.4;


import "zeppelin/contracts/Killable.sol";

contract Market is Killable {

  string public text;
  bool public active;
  mapping(bool => mapping(address => uint)) bets;
  mapping(bool => uint) totals;

  function Market(string _text) {
    text = _text;
    active = true;
  }

  // sending money to the contract equals a bet for true
  function () payable {
    bet(true)
  }

  // bet for the outcome of the fact
  function bet(bool prediction) payable {
    bets[prediction][msg.sender] = msg.value;
  }

  // owner chooses the winning outcome, distributing funds to the winners and killing the contract
  function chooseOutcome(bool outcome) onlyOwner {
    //pay out to winners

    active = false;
  }

  // contract should only be killable after it has been resolved
  function kill() onlyOwner {
    if(!active)
      super.kill();
  }



}
