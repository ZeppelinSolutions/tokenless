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


## Web App
The web application will serve as an interface for the two contracts.

### Main view
Users will be able to see a list of active markets, view details for each one, and have the option to bet in them.

### Log view
Users will see a list of active markets they have placed bets in, and a history of resolved markets they have participated in, with logs of how much they bet and how much they won.
