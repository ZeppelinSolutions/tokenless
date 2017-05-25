import { default as contract } from 'truffle-contract'

import artifacts from '../../build/contracts/Market.json'

const Market = contract(artifacts)
export default Market
