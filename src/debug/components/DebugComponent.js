import React from 'react';
import { connect } from 'react-redux';
import * as web3Util from '../../utils/Web3Util';
import {
  setActiveAccountIndex
} from '../../network/actions';
import {
  USE_INJECTED_WEB3,
  TARGET_LIVE_NETWORK
} from "../../constants";
import * as web3util from '../../utils/Web3Util';
import * as dateUtil from '../../utils/DateUtil';

class Debug extends React.Component {

  constructor() {
    super();

    this.state = {
      accountBalance: '',
      accountIndex: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.accounts.length > 0 && this.props.globalState.network.web3) {
      this.updateBalance();
    }
  }

  async updateBalance() {
    const address = this.props.accounts[this.state.accountIndex];
    const balance = await web3Util.getBalanceInEther(address, this.props.globalState.network.web3);
    this.setState({
      accountBalance: balance
    });
  }

  onAccountSelected(index) {
    this.setState({
      accountIndex: index
    });
    this.props.setActiveAccountIndex(index);
    this.updateBalance();
  }

  async skipTime(seconds) {
    await web3util.skipTime(seconds, this.props.globalState.network.web3);
  }

  render() {

    const nowTimestamp = dateUtil.dateToUnix(new Date());
    const bcTimestamp = this.props.globalState.network.currentTime;
    const nowStr = dateUtil.unixToStr(bcTimestamp);
    const isDetached = Math.abs(nowTimestamp - bcTimestamp) > 2 * 60;
    // console.log('timestamp detach:', Math.abs(nowTimestamp - bcTimestamp));

    return (
      <div className='debugPanel'>

        {/* ACCOUNT SELECTOR */}
        { !USE_INJECTED_WEB3 &&
          <select className=""
                  onChange={(event) => this.onAccountSelected(event.target.value)}
                  defaultValue={0}>
            {this.props.accounts && this.props.accounts.map((account, index) => {
              return <option value={index} key={index}>ACCT {index}: {account}</option>;
            })}
          </select>
        }

        {/* ACCOUNT BALANCE */}
        &nbsp;
        { this.props.globalState.network.activeAccountAddress !== undefined &&
          <small>
            Active acct: {this.props.globalState.network.activeAccountAddress}&nbsp;|&nbsp;
            {this.state.accountBalance} eth&nbsp;
          </small>
        }
        <br/>

        {/* NETWORK ID */}
        {this.props.globalState.network.networkName &&
          <span>
            [{this.props.globalState.network.networkName}]&nbsp;
          </span>
        }

        {/* BLOCK NUM */}
        {this.props.globalState.network.blockNumber !== undefined &&
          <span>
            [block {this.props.globalState.network.blockNumber}]&nbsp;
          </span>
        }

        {/* BLOCKCHAIN TIMESTAMP */}
        { bcTimestamp &&
          <span className={`text-${isDetached ? 'danger' : 'default'}`}>
            [time {nowStr}]&nbsp;
          </span>
        }
        {/* SKIP */}
        {TARGET_LIVE_NETWORK === 'testrpc' &&
          <span>
            <button onClick={() => { this.skipTime(60);                }}> +1m  </button>
            <button onClick={() => { this.skipTime(10 * 60);           }}> +10m </button>
            <button onClick={() => { this.skipTime(60 * 60);           }}> +1h  </button>
            <button onClick={() => { this.skipTime(10 * 60 * 60);      }}> +10h </button>
            <button onClick={() => { this.skipTime(24 * 60 * 60);      }}> +1d  </button>
            <button onClick={() => { this.skipTime(10 * 24 * 60 * 60); }}> +1d  </button>&nbsp;
          </span>
        }

        {/* SEND DUMMY TRANSACTION */}
        {TARGET_LIVE_NETWORK === 'testrpc' &&
          <span>
            <button onClick={(evt) => {
              web3util.sendDummyTransaction(
                this.props.globalState.network.web3,
                this.props.globalState.network.activeAccountAddress
              );
            }}>Tx</button>&nbsp;
          </span>
        }

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('DebugContainer - state', state);
  const web3 = state.network.web3;
  return {
    globalState: state,
    accounts: web3 ? web3.eth.accounts : []
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveAccountIndex: (index) => dispatch(setActiveAccountIndex(index))
  };
};

const DebugContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Debug);

export default DebugContainer;
