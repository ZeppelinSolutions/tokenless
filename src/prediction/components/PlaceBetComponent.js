import React from 'react';
import { form } from 'react-inform';
import {ETH_SYMBOL} from "../../constants";

class PlaceBetComponent extends React.Component {

  handleBetSubmit(prediction) {
    const { betValue } = this.props.fields;
    this.props.form.forceValidate();
    if(!this.props.form.isValid()) return;
    this.props.placeBet(prediction, betValue.value);
  };

  render() {

    const { betValue } = this.props.fields;

    return (
      <div className={`panel panel-${!this.props.isOwned ? 'info' : 'default'}`}>
        <div className="panel-heading">
          <strong>Place a bet</strong>
        </div>
        <div className="panel-body">

          {/* OWNER CAN'T BET */}
          {this.props.isOwned &&
          <div>
            <h4 className="text-muted">
              Sorry, owner's can't bet on their own predictions.
            </h4>
          </div>
          }

          {/* BET FORM */}
          {!this.props.isOwned &&
          <form>

            {/* VALUE */}
            <div className={`form-group ${betValue.error ? 'has-danger' : ''}`}>
              <input
                type="text"
                className="form-control"
                placeholder={`0${ETH_SYMBOL}`}
                {...betValue.props}
              />
              <small className="text-danger">
                {betValue.error}
              </small>
            </div>

            {/* YES */}
            <button
              type="button"
              className="btn btn-info"
              onClick={(evt) => this.handleBetSubmit(true)}>
              Will Happen
            </button>

            &nbsp;

            {/* NO */}
            <button
              type="button"
              className="btn btn-danger"
              onClick={(evt) => this.handleBetSubmit(false)}>
              Won't Happen
            </button>
          </form>
          }

        </div>
      </div>
    );
  }
}

const fields = ['betValue'];
const validate = values => {
  // console.log('validate', values);
  const { betValue } = values;
  const errors = {};
  if (!betValue || betValue.length === 0) errors.betValue = 'Bet value is required.';
  if(isNaN(betValue)) errors.betValue = 'Please enter a valid number.';
  if(betValue > 50) errors.betValue = 'Whoa! Please enter a smaller bet.';
  if(betValue < 0.01) errors.betValue = 'Please enter a larger bet.';
  return errors;
};

export default form({
  fields,
  validate
})(PlaceBetComponent);
