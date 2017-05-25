import { FACTORY_LOADED, NETWORK_CONNECTED } from '../constants'

const nework = (state = { isConnected: false }, action) => {
  switch(action.type) {
    case NETWORK_CONNECTED:
      return { ...state, web3: action.web3, isConnected: true }
    default:
      return state;
  }
}

export default nework
