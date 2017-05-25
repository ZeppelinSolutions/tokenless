export const getMarketFactory = (state) =>
  Promise.resolve(state.markets.marketFactory)

// TODO: Ensure the first wallet is the correct one to use
// See https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#raising_hand-account-list-reflects-user-preference
export const getCurrentWallet = (state) =>
  Promise.resolve(state.network.web3.eth.accounts[0])

// TODO: Use a memoized selector
export const getMarkets = (state) =>
  Object.values(state.markets.byAddress)

export const getMarket = (state, address) =>
  state.markets.byAddress[address]

export const isConnected = (state) =>
  state.network.isConnected
