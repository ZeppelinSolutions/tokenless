import React from 'react'
import PropTypes from 'prop-types'
import Loading from './Loading'

class MarketDetails extends React.Component {

  // TODO: Wrap this component in a MarketLoader, or delegate to the wrapper container?
  componentWillMount() {
    this.props.fetchMarket()
  }

  render() {
    if (!this.props.market) {
      return (<Loading></Loading>)
    }
    return (
      <div>
        <h2>{this.props.market.text}</h2>
      </div>
    )
  }
}

MarketDetails.propTypes = {
  market: PropTypes.shape({
    text: PropTypes.string
  })
}

export default MarketDetails
