import React from 'react';
import _ from 'lodash';
import BubblePreloader from 'react-bubble-preloader';
import {ETH_SYMBOL, EXPLORER_URL, TARGET_LIVE_NETWORK} from "../../constants";

const HistoryComponent = ({
                            player,
                            betHistory,
                            balance
                          }) => {

  const showSpinner = betHistory === undefined || (betHistory.length === 0 && balance !== 0);

  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Bet history</strong>
      </div>
      <div className="panel-body">

        {/* LOADING HISTORY */}
        {showSpinner &&
          <BubblePreloader
            bubble={{ width: '1rem', height: '1rem' }}
            animation={{ speed: 2 }}
            className=""
            colors={['#cccccc', '#aaaaaa', '#999999']}
          />
        }

        {/* NO HISTORY */}
        {!showSpinner && betHistory && betHistory.length === 0 && balance === 0 &&
          <span>No bets found.</span>
        }

        {/* SHOW HISTORY */}
        {betHistory && betHistory.length > 0 &&
        <table className="table table-striped table-hover">

          {/* TABLE HEADER */}
          <thead>
          <tr>
            <th>From | Tx</th>
            <th>Bet</th>
            <th>Value</th>
          </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
          {_.map(betHistory, (item) => {
            const isSelf = item.from === player;
            return (
              <tr
                className={isSelf ? 'info' : 'default'}
                key={item.tx}
              >
                <td>

                  {/* SENDER */}
                  <small>
                    From: {item.from}
                  </small>
                  <br/>

                  {/* TX */}
                  <small>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${EXPLORER_URL[TARGET_LIVE_NETWORK]}tx/${item.tx}`}
                    >
                      Tx: {item.tx}
                    </a>
                  </small>
                </td>

                {/* YES/NO */}
                <td>{item.prediction === true ? 'yes' : 'no'}</td>

                {/* ETH */}
                <td>{item.value}{ETH_SYMBOL}</td>

              </tr>
            );
          })}
          </tbody>
        </table>
        }
      </div>
    </div>
  );
};

export default HistoryComponent;