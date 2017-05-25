import React from 'react'
import { connect } from 'react-redux'
import { createMarket } from '../actions/markets'

let CreateMarket = ({ dispatch }) => {
  let textInput, blocksInput

  const handleSubmit = (e) => {
    e.preventDefault()
    let market = {
      text: textInput.value,
      blocks: parseInt(blocksInput.value)
    }
    dispatch(createMarket(market))
    textInput.value = blocksInput.value = ""
  }

  return (
    <div>
      <h2>Create a new prediction</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <label>Predicate:</label>
          <input type="text" ref={node => {textInput = node}} />
        </p>
        <p>
          <label>Blocks:</label>
          <input type="number" ref={node => {blocksInput = node}} />
        </p>
        <button type="submit">Create market</button>
      </form>
    </div>
  )
}

CreateMarket = connect()(CreateMarket)
export default CreateMarket
