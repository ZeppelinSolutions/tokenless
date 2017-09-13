// These are required to enable ES6 on tets
// and it's dependencies.
require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

/*
* =====================
* To deploy in testnet:
* =====================
*
* Run this command:
* (ropsten)
* geth --testnet --rpc --rpcapi db,eth,net,web3,personal --rpcport 854x --rpcaddr 127.0.0.1 --rpccorsdomain "*" console --unlock "ownerAddr"
* or
* geth --fast --cache=1048 --testnet --unlock "0xmyaddress" --rpc --rpcapi "db,eth,net,web3,personal" --rpccorsdomain '*' --rpcaddr localhost --rpcport 854x
*
* (rinkeby)
* geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --rpcport 854x --rpcaddr 127.0.0.1 --rpccorsdomain "*" console --unlock 'ownerAddr'
*
* This will:
* 1) Start the local geth testnet node.
* 2) RPC it in localhost:8546
* 3) Interactively unlock the contract owner account.
*
* After the node starts and the account is unlocked, outside of geth, run:
* truffle migrate --network ropsten --reset
*
* */

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4000000
    },
    ropsten: {
      host: "localhost",
      port: 8546,
      network_id: "3"
    },
    rinkeby: {
      host: "localhost",
      port: 8547,
      network_id: "4"
    }
  }
};
