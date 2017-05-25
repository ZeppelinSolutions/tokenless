import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { getUnicode } from 'emoji-dictionary'
import { stateToLabel } from '../utils'

const stats = (totalTrue, totalFalse) => {
  if (totalTrue != null && totalFalse != null) {
    let total = totalTrue + totalFalse;
    if (total == 0) {
      return "0 WEI total"
    }
    return `${(totalTrue  / total).toFixed(2)}% ${getUnicode('+1')} vs ${(totalFalse / total).toFixed(2)}% ${getUnicode('-1')} | ${total} WEI total`
  }
}

const MarketItem = ({ text, endBlock, address, state, totalTrue, totalFalse }) => {
  const endsOn = endBlock ? `| Ends on ${endBlock}` : ""
  const stateText = (state != null) ? `${stateToLabel(state)} ${endsOn}` : ""
  const statsInfo = stats(totalTrue, totalFalse)
  const info = (state != null) ? `${stateText} | ${statsInfo}` : "(loading)"

  return (
    <li>
      <Link to={`/predictions/${address}`}>
        {text}:
      </Link>
      &nbsp;
      <span>{info}</span>
    </li>
  )
}

MarketItem.propTypes = {
  text: PropTypes.string.isRequired,
  endBlock: PropTypes.number,
  address: PropTypes.string.isRequired,
  totalTrue: PropTypes.number,
  totalFalse: PropTypes.number,
  state: PropTypes.number,
}

export default MarketItem
