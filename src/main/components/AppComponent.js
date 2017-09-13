import React, { Component } from 'react';
import NavigationComponent from './NavigationComponent';
import DebugComponent from '../../debug/components/DebugComponent';
import IncompatibleComponent from './IncompatibleComponent';
import { connect } from 'react-redux';
import {
  DEBUG_MODE, TARGET_LIVE_NETWORK, USE_INJECTED_WEB3
} from '../../constants';

class App extends Component {

  render() {

    // INCOMPATIBLE.
    const isChrome = !!window.chrome && !!window.chrome.webstore;
    const hasMetamask = !USE_INJECTED_WEB3 || (USE_INJECTED_WEB3 && !!this.props.web3);
    const onProperNetwork = !USE_INJECTED_WEB3 || (this.props.networkName === undefined) || (this.props.networkName && this.props.networkName === TARGET_LIVE_NETWORK);
    if(!isChrome || !hasMetamask || !onProperNetwork) {
      return <IncompatibleComponent isChrome={isChrome} hasMetamask={hasMetamask} onProperNetwork={onProperNetwork}/>;
    }

    return (
      <div className="">

        {/* NAV */}
        <NavigationComponent path={this.props.location.pathname}/>

        {/* BODY */}
        <div className="wrapper">
          {/* CONTENT MANAGED BY ROUTES */}
          {this.props.children}
        </div>

        {/* FOOTER */}
        <footer className="row footer-muted" style={{height: DEBUG_MODE ? '120px' : '30px'}}>
          <div className="text-center">
            <small className="text-muted">
              <span className="glyphicon glyphicon-flash" aria-hidden="true"></span>
              Powered by OpenZeppelin |&nbsp;
              <a
                href="https://github.com/ajsantander/tokenless"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-github" aria-hidden="true"></i>&nbsp;Github
              </a>
            </small>
          </div>
        </footer>

        {/* DEBUG UI */}
        <footer className="footer navbar-fixed-bottom">
          {DEBUG_MODE &&
            <DebugComponent/>
          }
        </footer>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.network.web3,
    networkName: state.network.networkName,
    isNetworkConnected: state.network.isConnected,
    activeAccountAddress: state.network.activeAccountAddress
  };
}

export default connect(mapStateToProps, null)(App);
