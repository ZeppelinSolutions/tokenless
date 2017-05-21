var DefaultBuilder = require("truffle-default-builder");
require('babel-core/register');
require('babel-polyfill');


module.exports = {
  build: new DefaultBuilder({
    "index.html": "index.html",
    "app.js": [
      "javascripts/jquery.min.js",
      "javascripts/jquery.dataTables.js",
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "jquery.dataTables.css": [
      "stylesheets/jquery.dataTables.css"
    ]
  }),
  networks: {
    development: {
      host: process.env.RPC_HOST || "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
