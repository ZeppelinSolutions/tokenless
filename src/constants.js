// General.
export const DEBUG_MODE = false; // activates a debug panel useful for development
export const USE_INJECTED_WEB3 = true; // for use with eg. metamask
export const TARGET_LIVE_NETWORK = 'ropsten'; // ropsten, mainnet, testrpc
export const GIPHY_API_KEY = '5e2f35d1a57a44ae8415389a4c2efaab';
export const USE_CACHE = true;
export const SHOW_VERSION = true;
export const CHECK_NETWORK_TICK = 5000;
export const CHECK_ACCOUNT_TICK = 500;
export const ETH_SYMBOL = ' Ξ';
export const HISTORY_CHECK_BATCH = 1000;
export const FETCH_PREDICTIONS_BATCH = 15;

// Market contract urls.
export const MARKET_ADDRESS = {
  mainnet: '',
  ropsten: '0x60b45651d19e1cdeeef802bfe64cd9dea6107b1b',
  testrpc: '0x85a84691547b7ccf19d7c31977a7f8c0af1fb25a'
};

// Old ropsten markets (most recent on top):
// 0x60b45651d19e1cdeeef802bfe64cd9dea6107b1b
// 0x7b6103e6be6cfad55c167fa94c148ac459ecc847
// 0x385a77447f640b9a06bbbce70c6eaa401dce3810
// 0xa2d93fe188660e0ff8fdf27dd32b6568f0822055
// 0x6C12aF0d66552f5379D626D921755203686767b5

// Block explorer urls.
export const EXPLORER_URL = {
  testrpc: 'http://localhost:8000/#/', // requires: geth --rpc --rpccorsdomain "http://localhost:8000"
  ropsten: 'https://ropsten.etherscan.io/',
  mainnet: 'https://etherscan.io/'
};

// Router paths.
const baseURL = '';
export const PATH_CREATE = baseURL + '/create';
export const PATH_PREDICTION = baseURL + '/prediction/:address';
export const PATH_ROOT = baseURL + '/';
export const PATH_LIST = baseURL + '/list/:page';
export const PATH_ABOUT = baseURL + '/about';
export const SITE_URL = 'https://tokenless-32142.firebaseapp.com/';

// Local storage.
export const STORAGE_PREVIEW_KEY = 'tk_preview_' + TARGET_LIVE_NETWORK + '_';
export const STORAGE_PREDICTION_KEY = 'tk_prediction_' + TARGET_LIVE_NETWORK + '_';
export const STORAGE_MARKET_KEY = 'tk_market_' + TARGET_LIVE_NETWORK + '_';