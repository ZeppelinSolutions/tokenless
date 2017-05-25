import { FACTORY_LOADED, MARKET_CREATED_EVENT, MARKET_LOADED } from '../constants'
import { CREATE_MARKET_GAS } from '../constants'
import { getMarketFactory, getCurrentWallet } from '../selectors'

import MarketFactory from '../contracts/MarketFactory'
import Market from '../contracts/Market'

export const marketCreated = (market) => ({
  type: MARKET_CREATED_EVENT,
  market
})

const factoryLoaded = (factory) => ({
  type: FACTORY_LOADED,
  factory
})

export const marketLoaded = (market) => ({
  type: MARKET_LOADED,
  market
})

export const loadMarket = (address) => (dispatch, getState) => {
  // TODO: Should check isFetching and didInvalidate flags rather than a contract being set
  const currentMarket = getState().markets[address];
  if (currentMarket && currentMarket.contract) return;

  Market.at(address).then((market) => {
    // TODO: Load endBlock as well here, figure out why was yielding an invalid opcode error
    Promise
      .all([market.getState(), market.text(), market.totals(true), market.totals(false)])
      .then(([state, text, totalTrue, totalFalse]) =>
        dispatch(marketLoaded({
          address: address,
          state: state.toNumber(),
          text: text,
          totalTrue: totalTrue.toNumber(),
          totalFalse: totalFalse.toNumber(),
          contract: market
        }))
      ).catch((err) => {
        console.error(err)
      })

    // TODO: Listen for bets. On index or just when focused?
    // market.Bet({}, {fromBlock: 0, toBlock: 'latest'}, onBet(dispatch, {address}))
  })
}

export const createMarket = ({text, blocks}) => (dispatch, getState) => {
  let state = getState()
  Promise.all([getCurrentWallet(state), getMarketFactory(state)]).then(([wallet, factory]) => {
    // TODO: Handle no wallet available
    console.log("Creating market from account", wallet)
    factory.createMarket(text, blocks, {from: wallet, gas: CREATE_MARKET_GAS}).then((tx) => {
      // TODO: Track status of created market and update
    })
  })
}

export const loadMarketFactory = () => (dispatch) => {
  MarketFactory.deployed().then((factory) => {
    dispatch(factoryLoaded(factory))
    factory.MarketCreated({}, {fromBlock: 0, toBlock: 'latest'}, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        // TODO: Check for blockNumber == null for unconfirmed transactions
        const address = result.args.marketAddress
        dispatch(marketCreated({
          text: result.args.text,
          address: address,
          endBlock: result.args.endBlock.toNumber()
        }))
        dispatch(loadMarket(address))
      }
    })
  }).catch((err) => {
    console.error(err)
  })
}
