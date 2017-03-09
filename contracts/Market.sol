pragma solidity ^0.4.4;


import "zeppelin/lifecycle/Killable.sol";
import "zeppelin/payment/PullPayment.sol";


contract Market is Killable, PullPayment {

  enum State { Open, Closed, Resolved, Finished }

  string public text;
  bool public outcome;
  mapping(bool => mapping(address => uint)) public bets;
  mapping(bool => uint) public totals;
  uint public endDate; //block number
  uint private fee;
  uint private multiplier;
  State public state;

  function isOpen() external constant returns(bool) {
    return state == State.Open;
  }

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

  event Bet(address from, bool prediction, uint value);

  function bet(bool prediction) payable stateIs(State.Open) {
    if(block.number < endDate && msg.value > 0) { //TODO: determine a good minimum bet amount
      bets[prediction][msg.sender] += msg.value;

      totals[prediction] += msg.value;

      Bet(msg.sender, prediction, msg.value);
    } else {
      throw;
    }
  }

  //checks if the end of betting period is reached
  function checkDate() stateIs(State.Open) external {
    if(block.number >= endDate) {
      state = State.Closed;
    }
  }

  //checks if the end withdrawal period is reached
  function checkDateWithdrawals() stateIs(State.Resolved) external {
    if(block.number >= endDate) {
      state = State.Finished;
    }
  }

  event Resolved(bool outcome);

  function chooseOutcome(bool _outcome) onlyOwner stateIs(State.Closed) external {
    outcome = _outcome;

    state = State.Resolved;

    //set to about a week from current block number
    endDate = block.number + 43200;

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

  // contract should only be killable after withdrawal period is over
  function kill() onlyOwner {
    if(state == State.Finished)
      super.kill();
  }

  modifier stateIs(State _state) {
    if(state != _state)
      throw;
    _;
  }



}
