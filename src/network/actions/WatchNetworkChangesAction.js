// import { connectNetwork } from "./connectNetworkAction";
import * as web3Util from '../../utils/Web3Util';
import _ from 'lodash';
import {CHECK_NETWORK_TICK} from "../../constants";
import { updateDynamicPredictionData } from '../../prediction/actions';
import {updateDynamicMarketData} from "../../market/actions/ConnectMarketAction";

export const UPDATE_NETWORK = 'network/UPDATE_NETWORK';

export function watchNetworkChanges() {
  console.log('watchNetworkChanges()');
  return function(dispatch, getState) {

    const web3 = getState().network.web3;

    // Query the network with an interval.
    setInterval(async () => {

      // console.log('watch network tick');

      // Get new network data.
      const blockchain = {};
      blockchain.blockNumber = await web3Util.getBlockNumber(web3);
      blockchain.networkId = await web3Util.getNetworkId(web3);
      if(blockchain.networkId) {
        if(blockchain.networkId === '1') blockchain.networkName = 'mainnet';
        else if(blockchain.networkId === '2') blockchain.networkName = 'morden';
        else if(blockchain.networkId === '3') blockchain.networkName = 'ropsten';
        else if(blockchain.networkId === '4') blockchain.networkName = 'rinkeby';
        else if(blockchain.networkId === '42') blockchain.networkName = 'kovan';
        else blockchain.networkName = 'testrpc';
      }
      // console.log('blockchain', blockchain);

      // Compare with known data.
      const relevantKeys = [
        'blockNumber',
        'networkId'
      ];
      const oldData = _.pick(getState().network, relevantKeys);
      // console.log('old', oldData);
      const changed = _.isEmpty(oldData) || !_.isMatch(blockchain, oldData);
      // console.log('changed:', changed);
      if(!changed) return;

      // Get extra info.
      blockchain.currentTime = await web3Util.getTimestamp(web3);

      dispatch({
        type: UPDATE_NETWORK,
        payload: blockchain
      });

      // Update market.
      dispatch(updateDynamicMarketData());

      // Check if focused prediction needs to be updated.
      const isPredictionConnected = getState().prediction.isConnected;
      // console.log('need to update prediction:', isPredictionConnected);
      if(isPredictionConnected) {
        dispatch(updateDynamicPredictionData(getState().prediction.targetPredictionAddress));
      }
    }, CHECK_NETWORK_TICK);
  };
}
