pragma solidity ^0.4.11;


import "zeppelin/lifecycle/Destructible.sol";
import "zeppelin/payment/PullPayment.sol";
import "zeppelin/SafeMath.sol";


contract Market is Destructible, PullPayment {

  using SafeMath for uint;

  enum State { Open, Closed, Resolved, Finished }

  uint constant fee = 2; // in %
  uint constant multiplier = 100000;
  uint constant withdrawalPeriod = 43200;
  uint constant minBet = 1000;
  uint constant maxBet = 100 * (10 ** 18); // 100 ether

  string public text;
  bool public outcome;
  uint public endBlock; //block number

  mapping(bool => mapping(address => uint)) public bets;
  mapping(bool => uint) public totals;

  bool private resolved = false;

  function Market(string _text, uint _endBlock) {
    text = _text;
    endBlock = _endBlock;
  }

  // sending money to the contract equals a bet for true
  // TODO: Review. Shouldn't we just reject it?
  function () payable stateIs(State.Open) {
    bet(true);
  }

  event Bet(address indexed from, bool prediction, uint value);

  function bet(bool prediction) payable stateIs(State.Open) {
    if(msg.value < minBet || msg.value > maxBet) {
      throw;
    }

    bets[prediction][msg.sender] = bets[prediction][msg.sender].add(msg.value);
    totals[prediction] = totals[prediction].add(msg.value);
    Bet(msg.sender, prediction, msg.value);
  }

  function getState() constant returns (State) {
    if (!resolved) {
      if (block.number < endBlock) {
        return State.Open;
      } else {
        return State.Closed;
      }
    } else {
      if (block.number < endBlock) {
        return State.Resolved;
      } else {
        return State.Finished;
      }
    }
  }

  event Resolved(bool outcome);

  function chooseOutcome(bool _outcome) onlyOwner stateIs(State.Closed) external {
    outcome = _outcome;
    resolved = true;
    endBlock = block.number + withdrawalPeriod;

    Resolved(outcome);
  }

  // TODO: Should we just use ufixed types with non-int division instead of a "multiplier"?
  function claimWinnings() stateIs(State.Resolved) external {
    if(bets[outcome][msg.sender] > 0) {
      uint percentage = bets[outcome][msg.sender].mul(multiplier).div(totals[outcome]);
      uint winnings = totals[!outcome].mul(percentage).div(multiplier);
      uint rake = winnings.mul(fee).div(100);
      winnings = winnings - rake;

      asyncSend(msg.sender, winnings + bets[outcome][msg.sender]);
      bets[outcome][msg.sender] = 0;
    }
  }

  function destroy() onlyOwner stateIs(State.Finished) {
    super.destroy();
  }

  modifier stateIs(State _state) {
    if(getState() != _state)
      throw;
    _;
  }
}
