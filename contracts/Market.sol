pragma solidity ^0.4.4;


import "zeppelin/contracts/Killable.sol";

contract Market is Killable {

  string public text;
  bool public active;
  mapping(bool => mapping(address => uint)) bets;
  mapping(bool => string) outcomes;
  mapping(bool => uint) totals;

  function Market(string _text, string trueOutcome, string falseOutcome) {
    text = _text;
    active = true;

    //Should choosing outcomes even be an option or should it be limited to the same true/false?
    outcomes[true] = trueOutcome;
    outcomes[false] = falseOutcome;
  }

  // sending money to the contract equals a bet for true
  function () payable onlyActive {
    bet(true)
  }

  function bet(bool prediction) payable onlyActive {
    //multiple bets?
    bets[prediction][msg.sender] += msg.value;

    totals[prediction] += msg.value;
  }

  // owner chooses the winning outcome, distributing funds to the winners and deactivating the contract
  function chooseOutcome(bool outcome) onlyOwner onlyActive {
    //pay out to winners

    //how is the payout calculated?

    //notify Participants?

    active = false;
  }

  // contract should only be killable after it has been resolved
  function kill() onlyOwner {
    if(!active)
      super.kill();
  }

  modifier onlyActive() {
    if(active)
      _;
  }



}
