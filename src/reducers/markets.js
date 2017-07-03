import { MARKET_LOADED, MARKET_CREATED_EVENT, FACTORY_LOADED } from '../constants'

const initialState = {
  marketFactory: null,
  byAddress: { }
}

const markets = (state = initialState, action) => {
  switch(action.type) {
    case FACTORY_LOADED:
      return {
        ...state,
        marketFactory: action.factory
      }
    case MARKET_CREATED_EVENT:
    case MARKET_LOADED:
      const address = action.market.address
      const market = { ...state.byAddress[address], ...action.market }
      return {
        ...state,
        byAddress: { ...state.byAddress, [address]: market }
      }
    default:
      return state
  }
}

export default markets
