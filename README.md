# Tokenless Prediction Market
A tokenless prediction prediction based on OpenZeppelin/tokenless.

## Live Testnet Version
[https://tokenless-32142.firebaseapp.com/](https://tokenless-32142.firebaseapp.com/)

## Development

Download sources:
```git clone git@github.com:ajsantander/tokenless.git```

Install packages:
```npm install```

Run custom testrpc:
```npm run rpc 0```
(you may replace the 0 for any other block mining time)
This script is handy for quickly restarting the testrpc and re-deploying the contract, 
always with the same address, at the same time.

Start UI server:
```npm start```

Run Solidity Tests:
```truffle test```

![solidity tests](/img/soltest.png?raw=true "Solidity Tests")

Deploy:
```npm run deploy```

Stop custom testrpc:
```npm run killrpc```

More:

[create-react-app](https://github.com/facebookincubator/create-react-app)

## Configuration 

See: [constants.js](https://github.com/ajsantander/tokenless/blob/master/src/constants.js)

DEBUG_MODE, USE_INJECTED_WEB3, TARGET_LIVE_NETWORK, etc...

## Bootstrap / Setup

This project is built on top trufle-box/react-auth-box, which uses create-react-app
with React, Redux and Router. 

The Ethereum/Solidity bootstrap is handled by truffle and the solidity code is build with OpenZeppelin.

See [truffle-box](https://github.com/truffle-box/react-auth-box) for details on project
bootstrap and configuration.