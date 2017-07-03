import { NETWORK_CONNECTED, FACTORY_LOADED } from '../constants';
import { marketCreated, loadMarketFactory } from './markets'
import MarketFactory from '../contracts/MarketFactory'
import Market from '../contracts/Market'

const networkConnected = (web3) => ({
  type: NETWORK_CONNECTED,
  web3
})

export const networkStart = (web3) => (dispatch) => {
  Market.setProvider(web3.currentProvider)
  MarketFactory.setProvider(web3.currentProvider)

  dispatch(networkConnected(web3))
  dispatch(loadMarketFactory())
};
