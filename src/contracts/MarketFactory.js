import { default as contract } from 'truffle-contract'

import artifacts from '../../build/contracts/MarketFactory.json'

const MarketFactory = contract(artifacts)
export default MarketFactory
