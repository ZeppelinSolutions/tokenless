pragma solidity ^0.4.4;


import "./zeppelin/Killable.sol";
import "./zeppelin/PullPayment.sol";


contract Market is Killable, PullPayment {

  enum State { Open, Closed, Resolved }

  string public text;
  bool outcome;
  mapping(bool => mapping(address => uint)) bets;
  mapping(bool => uint) totals;
  uint public endDate; //block number
  uint private fee;
  uint private multiplier;
  State state;

  function Market(string _text, uint _endDate) {
    text = _text;
    endDate = _endDate;
    state = State.Open;
    multiplier = 100;
    fee = 2; //2%
  }

  // sending money to the contract equals a bet for true
  function () payable stateIs(State.Open) {
    bet(true);
  }

  event Bet(address _from, bool prediction, uint value);

  function bet(bool prediction) payable stateIs(State.Open) {
    bets[prediction][msg.sender] += msg.value;

    totals[prediction] += msg.value;

    Bet(msg.sender, prediction, msg.value);
  }

  function checkDate() stateIs(State.Open) external {
    if(block.number >= endDate) {
      state = State.Closed;
    }
  }

  event Resolved(bool prediction);

  function chooseOutcome(bool _outcome) onlyOwner stateIs(State.Closed) external {
    outcome = _outcome;

    state = State.Resolved;

    //notify Participants via event
    Resolved(outcome);
  }

  function claimWinnings() stateIs(State.Resolved) external {
    if(bets[outcome][msg.sender] > 0) {
      uint percentage = (bets[outcome][msg.sender] * multiplier) / totals[outcome];
      uint winnings = (totals[!outcome] * percentage) / multiplier;
      uint rake = (winnings * fee) / multiplier;
      winnings = winnings - rake;
      asyncSend(msg.sender, winnings + bets[outcome][msg.sender]);
      bets[outcome][msg.sender] = 0;
    }
  }

  // contract should only be killable after it has been resolved
  function kill() onlyOwner {
    if(state == State.Resolved)
      super.kill();
  }

  modifier stateIs(State _state) {
    if(state != _state)
      throw;
    _;
  }



}
