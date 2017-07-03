import React from 'react'
import MarketsList from '../containers/MarketsList'
import CreateMarket from '../containers/CreateMarket'

const MainPage = () => (
  <div>
    <h1>Tokenless prediction market</h1>
    <MarketsList />
    <CreateMarket />
  </div>
)

export default MainPage
