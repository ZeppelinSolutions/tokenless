import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import MarketListItemComponent from '../components/PredictionListItemComponent';
import ConnectComponent from '../../common/components/ConnectComponent';
import { push } from 'react-router-redux';
import {
  getPredictionPreview
} from '../actions';
import {
  TARGET_LIVE_NETWORK,
  EXPLORER_URL, FETCH_PREDICTIONS_BATCH,
} from "../../constants";

class Market extends React.Component {

  componentWillReceiveProps(nextProps) {

    // Check which previews have been updated.
    if(nextProps.addresses) {
      const offset = nextProps.routeParams.page * FETCH_PREDICTIONS_BATCH;
      const limit = Math.min(offset + FETCH_PREDICTIONS_BATCH, nextProps.addresses.length);
      for(let i = offset; i < limit; i++) {
        const address = nextProps.addresses[i];
        const preview = nextProps.previews[address];
        // console.log('preview:', i, preview);
        if(!preview) {
          nextProps.getPredictionPreview(address);
        }
      }
    }
  }

  render() {

    // CONNECTING/PROCESSING...
    if(!this.props.isConnected || this.props.isWaiting) {
      return (
        <div>
          <ConnectComponent title={!this.props.isConnected ? "Connecting with smart contract..." : "Processing transaction..."}/>
        </div>
      );
    }

    const showNoItems = this.props.addresses === undefined || (this.props.addresses && this.props.addresses.length === 0);
    const offset = this.props.routeParams.page * FETCH_PREDICTIONS_BATCH || 0;

    // Build pagination links.
    const pageItems = [];
    const nextPage = +this.props.routeParams.page + 1;
    const prevPage = Math.max(+this.props.routeParams.page - 1, 0);
    if(this.props.addresses && this.props.addresses.length > FETCH_PREDICTIONS_BATCH) {
      for(let i = 0; i < this.props.addresses.length; i += FETCH_PREDICTIONS_BATCH) {
        const page = Math.floor(i / FETCH_PREDICTIONS_BATCH);
        pageItems.push(
          <li className={+this.props.routeParams.page === page ? 'active' : ''}>
            <Link to={`/list/${page}`}>
              {page}
            </Link>
          </li>
        );
      }
    }

    // Build list items array.
    const listItems = [];
    if(!showNoItems) {
      const limit = Math.min(offset + FETCH_PREDICTIONS_BATCH, this.props.addresses.length);
      for(let i = offset; i < limit; i++) {
        const address = this.props.addresses[i];
        const preview = this.props.previews[address];
        listItems.push( <MarketListItemComponent
          key={address}
          address={address}
          preview={preview}
        />);
      }
      // console.log('listItems', listItems);
    }

    return (
      <div className="container">

        <div className="panel panel-primary">
          <div className="panel-body">


              {/* LIST MARKETS PANEL */}
              <div className="">

                {/* NO ITEMS */}
                {showNoItems &&
                  <div className="alert alert-default">
                    <span className="text-muted">
                      No predictions yet.
                    </span>
                  </div>
                }

                {/* LIST */}
                {this.props.addresses && this.props.addresses.length > 0 &&
                  <ul className="list-group">
                    {listItems}
                  </ul>
                }

                {/* PAGINATION */}
                { this.props.addresses && this.props.addresses.length > 0 &&
                offset + FETCH_PREDICTIONS_BATCH < this.props.addresses.length &&
                <ol className="pagination">
                  <li>
                    <Link to={`/list/${prevPage}`}>
                      <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </Link>
                  </li>
                  {pageItems}
                  <li>
                    <Link to={`/list/${nextPage}`}>
                      <i className="fa fa-chevron-right" aria-hidden="true"></i>
                    </Link>
                  </li>
                </ol>
                }

              </div>

              {/* LINK TO CREATE */}
              <Link to="/create">
                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;
                Create a New Prediction
              </Link>

              &nbsp;
              &nbsp;

              {/* LINK TO ABOUT */}
              <Link to="/about">
                <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;
                About
              </Link>

              <br/>
              <br/>

              {/* LINK TO EXPLORER */}
              <a
                href={`${EXPLORER_URL[TARGET_LIVE_NETWORK]}address/${this.props.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;
                Explore Contract
              </a>

              {/* FAUCET LINK */}
              {TARGET_LIVE_NETWORK === 'ropsten' &&
                <span>
                  &nbsp;&nbsp;
                  <a
                    href="https://faucet.metamask.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="glyphicon glyphicon-tint" aria-hidden="true"></span>&nbsp;
                    Metamask Faucet
                  </a>
                </span>
              }

            </div>

          </div>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    addresses: state.market.predictionAddresses,
    previews: state.market.previews,
    isNetworkConnected: state.network.isConnected,
    blockNumber: state.network.blockNumber,
    ...state.market
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPredictionPreview: (address) => dispatch(getPredictionPreview(address)),
    push: (url) => dispatch(push(url))
  };
};

const MarketComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);

export default MarketComponent;
