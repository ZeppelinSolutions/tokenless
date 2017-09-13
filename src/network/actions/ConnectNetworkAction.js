import Web3 from 'web3';
import { setActiveAccountIndex } from './SetActiveAccountAction';
import { connectMarket } from '../../market/actions/ConnectMarketAction';
import { USE_INJECTED_WEB3 } from '../../constants';
import {
  watchAccountChanges,
  watchNetworkChanges
} from '.';

export const CONNECT_NETWORK = 'network/CONNECT_NETWORK';

export function connectNetwork() {
  console.log('connectNetwork()');
  return function(dispatch) {

    let web3;
    if(USE_INJECTED_WEB3) {
      console.log('using injected web3 instance');
      web3 = window.web3;
    }
    else {
      console.log('using own web3 instance');
      const provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(provider);
    }
    if(!web3) return;
    console.log('web3 provider:', web3.currentProvider !== undefined);

    dispatch({
      type: CONNECT_NETWORK,
      payload: web3
    });

    dispatch(connectMarket());
    dispatch(watchNetworkChanges());
    dispatch(setActiveAccountIndex(0));

    if(USE_INJECTED_WEB3) {
      dispatch(watchAccountChanges());
    }
  };
}
