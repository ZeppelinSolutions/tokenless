import { connect } from 'react-redux'
import { getMarkets } from '../selectors'
import component from '../components/MarketsList'

const mapStateToProps = (state) => ({
  markets: getMarkets(state)
})

const MarketsList = connect(mapStateToProps)(component)
export default MarketsList
