# Zeppelin Tokenless Prediction Market

A tokenless prediction market built using the Zeppelin Solidity framework.


## Contract Structure

#### Market
Tracks the bets for a single prediction.
Participants can send ether to bet on one of two outcomes.
Owner can choose the winning outcome.

### MarketFactory
Creates a Market contract for the sender.
Market contracts created through MarketFactory pay out fees back to the MarketFactory contract.
