import React from 'react'
import { Link } from 'react-router-dom'

import MarketDetails from '../containers/MarketDetails'

const MarketPage = ({ match }) => (
  <div>
    <Link to="/">Back</Link>
    <h1>Prediction {match.params.address.substring(0, 10)}...</h1>
    <MarketDetails address={match.params.address} />
  </div>
)

export default MarketPage
