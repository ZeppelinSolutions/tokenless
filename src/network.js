import Web3 from 'web3'

import { networkStart } from './actions/contracts'

export const startWeb3 = (dispatch) => {
  // From https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md
  window.addEventListener('load', function() {
    let provider;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      provider = new Web3(web3.currentProvider);
    } else {
      // Use local node
      provider = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    dispatch(networkStart(provider));
  });
}
