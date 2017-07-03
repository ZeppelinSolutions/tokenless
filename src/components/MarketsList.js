import React from 'react'
import PropTypes from 'prop-types'
import MarketItem from './MarketItem'

const MarketsList = ({ markets }) => (
  <ul>
    {markets.map(market =>
      <MarketItem
        key={market.address}
        {...market}
      />
    )}
  </ul>
)

MarketsList.propTypes = {
  markets: PropTypes.arrayOf(PropTypes.shape(MarketItem.propTypes).isRequired).isRequired
}

export default MarketsList
