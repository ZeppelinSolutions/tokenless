import React from 'react';
import { Link } from 'react-router';
import BubblePreloader from 'react-bubble-preloader';
import {ETH_SYMBOL} from "../../constants";

const MarketListItemComponent = ({
  address,
  preview
}) => {

  // console.log('preview', preview);

  return (
    <Link
      to={`/prediction/${address}`}
      className="list-group-item"
    >
      {/* FULL */}
      {preview && !preview.isFetching &&
        <div>
          {preview.statement}
          <div className="pull-right">

            {/* BALANCE */}
            {preview.balance > 0 &&
            <span>{preview.balance}{ETH_SYMBOL}&nbsp;</span>
            }

            {/* STATE */}
            <span className={`label label-${preview.predictionState === 0 ? 'success' : preview.predictionState === 1 ? 'warning' : preview.predictionState === 2 ? 'danger' : 'primary'}`}>
              {preview.predictionStateStr}
            </span>

          </div>
        </div>
      }

      {/* LOADING */}
      {preview && preview.isFetching &&
        <BubblePreloader
          bubble={{ width: '1rem', height: '1rem' }}
          animation={{ speed: 2 }}
          className=""
          colors={['#cccccc', '#aaaaaa', '#999999']}
        />
      }

      {/* ADDRESS */}
      {!preview &&
        <span>{address}</span>
      }

    </Link>
  );
};

export default MarketListItemComponent;
