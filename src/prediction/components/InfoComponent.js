import React from 'react';
import * as dateUtil from '../../utils/DateUtil';
import {ETH_SYMBOL} from "../../constants";

const InfoComponent = ({
                         positivePredicionBalance,
                         negativePredicionBalance,
                         isOwned,
                         predictionState,
                         predictionStateStr,
                         betEndDate,
                         withdrawPeriod,
                         outcome,
                         balance,
                         activeAccountAddress,
                         resolutionTimestamp
                       }) => {

  let predictionStateClass = 'info';
  if (predictionState === 1) predictionStateClass = 'warning';
  if (predictionState === 2 && outcome === false) predictionStateClass = 'danger';

  let stateStr = predictionStateStr;
  if (predictionState === 2) stateStr = `${predictionStateStr} for ${outcome ? 'Yes' : 'No'}`;
  if (predictionState === 3) stateStr = `${predictionStateStr} as ${outcome ? 'Yes' : 'No'}`;

  const historicalBalance = positivePredicionBalance + negativePredicionBalance;
  const posPercent = historicalBalance === 0 ? 0 : 100 * positivePredicionBalance / historicalBalance;
  const negPercent = historicalBalance === 0 ? 0 : 100 * negativePredicionBalance / historicalBalance;

  const shouldHideBalances = positivePredicionBalance === 0 && negativePredicionBalance === 0;

  return (

    <div>

      {/* POT BALANCES */}
      {balance !== undefined && !shouldHideBalances &&
      <div className="progress">
        <div className="progress-bar progress-bar-info" style={{width: `${posPercent}%`}}>
          {posPercent > 5 &&
            <span className="">
              <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
              {positivePredicionBalance}{ETH_SYMBOL}
            </span>
          }
        </div>
        <div className="progress-bar progress-bar-danger" style={{width: `${negPercent}%`}}>
          {negPercent > 5 &&
            <span className="">
              <span className="glyphicon glyphicon-thumbs-down"></span>&nbsp;
              {negativePredicionBalance}{ETH_SYMBOL}
            </span>
          }
        </div>
      </div>
      }

      {/* BADGES */}
      <ul className='list'>

        {/* TOTAL BALANCE */}
        {balance !== undefined &&
          <li className='list-inline-item'>
            <span className="label label-info">
              Balance: {balance}{ETH_SYMBOL}
            </span>
          </li>
        }

        {/* OWNED */}
        {isOwned &&
        <li className='list-inline-item'>
            <span className="label label-info">
              You own this prediction
            </span>
        </li>
        }

        {/* STATE */}
        <li className='list-inline-item'>
          <span className={`label label-${predictionStateClass}`}>
            {stateStr}
          </span>
        </li>

        {/* DATES */}
        {betEndDate !== undefined && predictionState !== 3 &&
          <li className='list-inline-item'>
            <span className="label label-default">
              Bets end on: {dateUtil.unixToStr(betEndDate)}
            </span>
          </li>
        }
        { predictionState > 0 && predictionState < 3 && resolutionTimestamp !== undefined &&
          <li className='list-inline-item'>
            <span className="label label-warning">
              Withdrawals end on: {dateUtil.unixToStr(resolutionTimestamp + withdrawPeriod)}
            </span>
          </li>
        }

        {/* UNLOCK ACCOUNT */}
        { activeAccountAddress === undefined &&
          <li className='list-inline-item'>
            <span className="label label-warning">
              Unlock your metamask wallet to interact with this prediction
            </span>
          </li>
        }

      </ul>

      <br/>

    </div>
  );
};

export default InfoComponent;
