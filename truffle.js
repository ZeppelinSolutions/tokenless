require('babel-register')
require('babel-polyfill');

module.exports = {
  build: 'webpack',
  networks: {
    development: {
      host: process.env.RPC_HOST || "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
