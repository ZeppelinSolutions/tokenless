import React from 'react'
import { connect } from 'react-redux'
import Component from '../components/MarketDetails'
import Loading from '../components/Loading'
import Market from '../contracts/Market'
import { loadMarket } from '../actions/markets'
import { getMarket, isConnected } from '../selectors'

const mapStateToProps = (state, ownProps) => ({
  market: getMarket(state, ownProps.address),
  isConnected: isConnected(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMarket: (() => dispatch(loadMarket(ownProps.address)))
})

class MarketDetailsOrLoading extends React.Component {
  render() {
    if (!this.props.isConnected) {
      return ((<Loading></Loading>))
    } else {
      return (<Component {...this.props}></Component>)
    }
  }
}

const MarketDetails = connect(mapStateToProps, mapDispatchToProps)(MarketDetailsOrLoading)
export default MarketDetails
