import React from 'react';
import {ETH_SYMBOL} from "../../constants";

const UserInfoComponent = ({
  playerPositiveBalance,
  playerNegativeBalance,
  playerPrizes,
  predictionState,
}) => {

  // Dont show if invalid.
  if(
    playerPositiveBalance === undefined ||
    playerNegativeBalance === undefined
  ) return null;

  // Don't show if empty.
  if(
    playerPositiveBalance === 0 &&
    playerNegativeBalance === 0 &&
    (!playerPrizes || playerPrizes === 0)
  ) return null;

  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Where you stand</strong>
      </div>
      <div className="panel-body">


          {/* BALANCES */}
          { playerPositiveBalance > 0 &&
            <div>
              Bets on yes: {playerPositiveBalance}{ETH_SYMBOL}
            </div>
          }
          { playerNegativeBalance > 0 &&
          <div>
            Bets on no: {playerNegativeBalance}{ETH_SYMBOL}
          </div>
          }

          {/* PRIZE */}
          { predictionState === 2 && playerPrizes > 0 &&
            <div>
              Prize to claim: {playerPrizes}{ETH_SYMBOL}
            </div>
          }


      </div>
    </div>
  );
};

export default UserInfoComponent;
