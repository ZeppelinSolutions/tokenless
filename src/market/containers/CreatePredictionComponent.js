import React from 'react';
import { connect } from 'react-redux';
import * as dateUtil from '../../utils/DateUtil';
import * as miscUtil from '../../utils/MiscUtil';
import NumberPicker from 'react-widgets/lib/NumberPicker';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { form } from 'react-inform';
import ConnectComponent from '../../common/components/ConnectComponent';
import {
  DEBUG_MODE, TARGET_LIVE_NETWORK
} from '../../constants';
import {
  createPrediction
} from '../actions';

function combinePeriods(days, hours, minutes) {
  return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60;
}

class CreatePredictionComponent extends React.Component {

  componentWillMount() {

    // Default values.
    let now = dateUtil.dateToUnix(new Date());
    let betEndDate = DEBUG_MODE || TARGET_LIVE_NETWORK === 'ropsten' ? dateUtil.unixToDate(now + 60) : dateUtil.unixToDate( now + dateUtil.daysToSeconds( 7 ) );
    this.props.form.onValues({
      statement: DEBUG_MODE ? miscUtil.makeid() : '',
      betEndDate,
      withdrawPeriodDays: DEBUG_MODE || TARGET_LIVE_NETWORK === 'ropsten' ? 0 : 7,
      withdrawPeriodHours: 0,
      withdrawPeriodMinutes: DEBUG_MODE || TARGET_LIVE_NETWORK === 'ropsten' ? 1 : 0,
    });
  }

  handleCreateSubmit() {

    const {
      statement,
      betEndDate,
      withdrawPeriodDays,
      withdrawPeriodHours,
      withdrawPeriodMinutes
    } = this.props.fields;

    // Final validation.
    this.props.form.forceValidate();
    if(!this.props.form.isValid()) return;

    // Combine withdraw values.
    const withdrawPeriod = combinePeriods(withdrawPeriodDays.value, withdrawPeriodHours.value, withdrawPeriodMinutes.value);
    // console.log('period:', withdrawPeriod);

    // Hit endpoint.
    this.props.createPrediction(
      statement.value,
      betEndDate.value,
      withdrawPeriod
    );
  }

  render() {

    // CONNECTING/PROCESSING...
    if(this.props.isWaiting) {
      return (
        <div>
          <ConnectComponent title="Processing transaction..." useGif={true}/>
        </div>
      );
    }

    const {
      statement,
      betEndDate,
      withdrawPeriodDays,
      withdrawPeriodHours,
      withdrawPeriodMinutes
    } = this.props.fields;
    // console.log('fields', this.props.fields);

    // Force cast values to numbers to avoid an annoying runtime error caused by react-widget.
    withdrawPeriodDays.props.value = +withdrawPeriodDays.props.value;
    withdrawPeriodHours.props.value = +withdrawPeriodHours.props.value;
    withdrawPeriodMinutes.props.value = +withdrawPeriodMinutes.props.value;

    return (
      <div className="container">

        {/* CREATE PREDICTION PANEL */}
        <div className="row">
          <div className="panel panel-info">

            <div className="panel-body">
              <form className="">

                {/* STATEMENT */}
                <div className={`form-group ${statement.error ? 'has-danger' : ''}`}>
                  <label>Statement</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder='Eg. "Ether will surpass bitcoin in 2018."'
                    {...statement.props}
                    />
                  <br/>
                  <small className="text-muted">
                    Please enter a falsable and measurable
                    statement that can be answered to yes or no,
                    once the prediction is resolved.
                  </small>
                  <div className="text-danger">
                    {statement.error}
                  </div>
                </div>

                <hr/>

                {/* BET END DATE */}
                <div className={`form-group ${betEndDate.error !== undefined ? 'has-danger' : ''}`}>
                  <label>Resolution Date</label>
                  <DateTimePicker
                    className="date-component"
                    step={DEBUG_MODE ? 1 : 15}
                    {...betEndDate.props}
                  />
                  <small className="text-danger">
                    {betEndDate.error}
                  </small>
                  <br/>
                  <small className="text-muted">
                    Upon this date, the prediction enters a period in which it can be resolved by it's owner to yes or no,
                    and players will no longer be able to place bets.
                    Once the owner resolves the prediction, all
                    players will be able to start withdrawing their prizes.
                    Note that the resolution date only represents the moment when bets close and resolution can occur,
                    but the actual resolution is an event that depends on an action taken by the owner of the prediction.
                  </small>
                </div>

                <hr/>

                {/* WITHDRAWAL PERIOD */}
                <div className={`form-group ${withdrawPeriodDays.error !== undefined ? 'has-danger' : ''}`}>
                  <label>Withdrawal Period:</label>
                  <div className="row">

                    {/* DAYS */}
                    <div className="col-sm-3">
                      <small className="text-muted">Days</small>
                      <NumberPicker
                        {...withdrawPeriodDays.props}
                      />
                    </div>

                    {/* HOURS */}
                    <div className="col-sm-3">
                      <small className="text-muted">Hours</small>
                      <NumberPicker
                        min={0}
                        max={23}
                        {...withdrawPeriodHours.props}
                      />
                    </div>

                    {/* MINUTES */}
                    <div className="col-sm-3">
                      <small className="text-muted">Minutes</small>
                      <NumberPicker
                        min={0}
                        max={59}
                        {...withdrawPeriodMinutes.props}
                      />
                    </div>

                  </div>
                  <small className="text-danger">
                    {withdrawPeriodDays.error || withdrawPeriodHours.error || withdrawPeriodMinutes.error}
                  </small>

                  <br/>

                  <small className="text-muted">
                    After the prediction is resolved,
                    the withdrawal period will begin, giving players time to withdraw their prizes.
                    When this period finishes, the owner of the prediction will be able to withdraw his fees
                    (and whatever still remains in the balance of the smart contract),
                    and players that didn't withdraw their prizes yet, may not be able to do so.
                  </small>
                  {this.props.minWithdrawPeriod !== undefined &&
                   this.props.minWithdrawPeriod !== 0 &&
                    <div>
                      <small className="text-default">
                        *The minimum of this market is {dateUtil.unixToHumanizedDuration(this.props.minWithdrawPeriod)}
                        &nbsp;after the resolution date.
                      </small>
                    </div>
                  }
                </div>

                {/* SUBMIT */}
                <button
                  type="button"
                  disabled={this.props.activeAccountAddress === undefined}
                  className="btn btn-info"
                  onClick={(evt) => this.handleCreateSubmit()}>
                  Create Prediction
                </button>
                {this.props.activeAccountAddress === undefined &&
                  <div className="text-danger">
                    Please unlock your metamask wallet to create a prediction.
                  </div>
                }

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  CreatePredictionComponent.minWithdrawPeriod = state.market.minWithdrawPeriod;
  return {
    activeAccountAddress: state.network.activeAccountAddress,
    bcTimestamp: state.network.currentTime,
    minWithdrawPeriod: state.market.minWithdrawPeriod,
    isWaiting: state.network.isWaiting
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPrediction: (statement, betEndDate, withdrawPeriod) => dispatch(createPrediction(statement, betEndDate, withdrawPeriod)),
  };
};

const fields = ['statement', 'betEndDate', 'withdrawPeriodDays', 'withdrawPeriodHours', 'withdrawPeriodMinutes'];
const validate = values => {
  // console.log('validate', values);

  const { statement, betEndDate, withdrawPeriodDays, withdrawPeriodHours, withdrawPeriodMinutes } = values;
  const errors = {};

  if (!statement || statement.length === 0) errors.statement = 'Statement is required.';

  const nowUnix = dateUtil.dateToUnix(new Date());
  if(betEndDate) {
    const betEndUnix = betEndDate.valueOf() / 1000;
    if(betEndUnix <= nowUnix) errors.betEndDate = 'Please enter a later resolution date.';
  }
  else errors.betEndDate = 'Resolution date is required.';

  if(CreatePredictionComponent.minWithdrawPeriod !== undefined) {
    const period = combinePeriods(withdrawPeriodDays, withdrawPeriodHours, withdrawPeriodMinutes);
    if(period < CreatePredictionComponent.minWithdrawPeriod) {
      errors.withdrawPeriodMinutes = 'Please provide a longer withdrawal period.';
    }
  }

  // console.log('errors:', errors);
  return errors;
};

const CreateMarketContainer = form({
  fields,
  validate
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePredictionComponent));

export default CreateMarketContainer;
