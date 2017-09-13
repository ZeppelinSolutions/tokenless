import React from 'react';
import { connect } from 'react-redux';
import ConnectComponent from '../../common/components/ConnectComponent';
import InfoComponent from '../components/InfoComponent';
import PlaceBetComponent from '../components/PlaceBetComponent';
import ResolveComponent from '../components/ResolveComponent';
import WithdrawComponent from '../components/WithdrawComponent';
import FinishComponent from '../components/FinishComponent';
import WaitComponent from '../components/WaitComponent';
import UserInfoComponent from '../components/UserInfoComponent';
import HistoryComponent from '../components/HistoryComponent';
import CommentsComponent from '../components/CommentsComponent';
import PurgeComponent from '../components/PurgeComponent';
import BubblePreloader from 'react-bubble-preloader';
import {
  resetPrediction,
  connectPrediction,
  placeBet,
  resolvePrediction,
  withdrawPrize,
  withdrawFees,
  purgePrediction
} from '../actions';
import {EXPLORER_URL, TARGET_LIVE_NETWORK} from "../../constants";

class Prediction extends React.Component {

  componentWillMount() {
    this.props.resetPrediction();
    this.props.connectPrediction(this.props.routeParams.address);
  }

  componentWillUnmount() {
    this.props.resetPrediction();
  }

  render() {

    // CONNECTING/PROCESSING...
    if(!this.props.isConnected || this.props.isWaiting) {
      return (
        <div>
          <ConnectComponent
            useGif={this.props.isWaiting}
            title={!this.props.isConnected ? "Connecting with smart contract..." : "Processing transaction..."}
          />
        </div>
      );
    }

    // Pre-process some of the prediction's data for display.
    const isOwned =
      this.props.owner !== undefined &&
      this.props.activeAccountAddress !== undefined &&
      this.props.activeAccountAddress === this.props.owner;

    // console.log('fees', this.props.estimateFees);

    return (
      <div className="container">

        {/* STATEMENT */}
        {this.props.statement &&
          <div className="page-header">
            <h1 className="prediction-statement">
              "{this.props.statement}"
            </h1>
          </div>
        }
        {!this.props.statement &&
          <BubblePreloader
            bubble={{ width: '1rem', height: '1rem' }}
            animation={{ speed: 2 }}
            className=""
            colors={['#cccccc', '#aaaaaa', '#999999']}
          />
        }

        <div className="">

          {/* INFO */}
          <InfoComponent
            betEndDate={this.props.betEndDate}
            resolutionTimestamp={this.props.resolutionTimestamp}
            withdrawPeriod={this.props.withdrawPeriod}
            positivePredicionBalance={this.props.positivePredicionBalance}
            negativePredicionBalance={this.props.negativePredicionBalance}
            isOwned={isOwned}
            activeAccountAddress={this.props.activeAccountAddress}
            predictionState={this.props.predictionState}
            predictionStateStr={this.props.predictionStateStr}
            outcome={this.props.outcome}
            balance={this.props.balance}
            />

          {/* FINISHED */}
          { this.props.predictionState !== undefined &&
            this.props.predictionState >= 3 &&
            this.props.balance === 0 &&
            <FinishComponent/>
          }

          {/* WITHDRAW PRIZE */}
          { this.props.activeAccountAddress !== undefined &&
            !isOwned &&
            this.props.predictionState !== undefined &&
            this.props.predictionState >= 2 &&
            this.props.estimatePrize > 0 &&
            <WithdrawComponent
              claimAmount={this.props.estimatePrize}
              claimMethod={this.props.withdrawPrize}
              />
          }

          {/* WITHDRAW FEES */}
          { this.props.activeAccountAddress !== undefined &&
            isOwned &&
            this.props.predictionState !== undefined &&
            this.props.predictionState >= 2 &&
            this.props.estimateFees > 0 &&
            this.props.balance > this.props.estimateFees &&
            <WithdrawComponent
              claimAmount={this.props.estimateFees}
              claimMethod={this.props.withdrawFees}
            />
          }

          {/* PURGE */}
          { this.props.predictionState !== undefined &&
            this.props.predictionState === 3 &&
            isOwned &&
            this.props.balance !== 0 &&
            <PurgeComponent
              purgePrediction={this.props.purgePrediction}
            />
          }

          {/* RESOLVE */}
          { this.props.activeAccountAddress !== undefined &&
            isOwned &&
            this.props.predictionState !== undefined &&
            this.props.predictionState === 1 &&
            <ResolveComponent
              resolvePrediction={this.props.resolvePrediction}
              />
          }

          {/* PLAYER WAIT */}
          { this.props.activeAccountAddress !== undefined &&
            !isOwned &&
            this.props.predictionState !== undefined &&
            this.props.predictionState === 1 &&
            <WaitComponent/>
          }

          {/* BET */}
          { this.props.activeAccountAddress !== undefined &&
            this.props.owner !== undefined &&
            this.props.predictionState !== undefined &&
            this.props.predictionState === 0 &&
            <PlaceBetComponent
              isOwned={isOwned}
              placeBet={this.props.placeBet}
              />
          }

          {/* USER INFO */}
          { this.props.activeAccountAddress !== undefined &&
            <UserInfoComponent
              bcTimestamp={this.props.bcTimestamp}
              predictionState={this.props.predictionState}
              playerPrizes={this.props.estimatePrize}
              playerPositiveBalance={this.props.playerPositiveBalance}
              playerNegativeBalance={this.props.playerNegativeBalance}
            />
          }

          {/* HISTORY */}
          {this.props.balance !== undefined &&
            <HistoryComponent
              balance={this.props.balance}
              player={this.props.activeAccountAddress}
              betHistory={this.props.betHistory}
            />
          }

          {/* LINK TO EXPLORER */}
          <div>
            <a
              href={`${EXPLORER_URL[TARGET_LIVE_NETWORK]}address/${this.props.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;
              Explore Contract
            </a>
          </div>

          {/* COMMENTS */}
          <br/>
          <br/>
          <CommentsComponent
            address={this.props.address}
          />

        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('PredictionComponent - state', state);
  return {
    isNetworkConnected: state.network.isConnected,
    activeAccountAddress: state.network.activeAccountAddress,
    blockNumber: state.network.blockNumber,
    web3: state.network.web3,
    bcTimestamp: state.network.currentTime,
    ...state.prediction,
    isWaiting: state.network.isWaiting
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectPrediction: (address) => dispatch(connectPrediction(address)),
    placeBet: (prediction, value) => dispatch(placeBet(prediction, value)),
    resolvePrediction: (outcome) => dispatch(resolvePrediction(outcome)),
    withdrawPrize: () => dispatch(withdrawPrize()),
    withdrawFees: () => dispatch(withdrawFees()),
    resetPrediction: () => dispatch(resetPrediction()),
    purgePrediction: () => dispatch(purgePrediction())
  };
};

const PredictionComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Prediction);

export default PredictionComponent;
