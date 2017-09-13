import React from 'react';
import BubblePreloader from 'react-bubble-preloader';
import RandomGifComponent from '../../common/components/RandomGifComponent';

const ConnectComponent = ({
  title,
  useGif
}) => {
  return (
    <div className="container">

      {/* TITLE */}
      <div className="page-header">
        <p className="text-muted">{title}</p>
        <BubblePreloader
          bubble={{ width: '1rem', height: '1rem' }}
          animation={{ speed: 2 }}
          className=""
          colors={['#ffbb33', '#FF8800', '#ff4444']}
        />
      </div>

      {/* SUBTITLE */}
      <div className="text-center">
        <small className="text-muted text-center">
          This may take a few seconds. Hang in there...
        </small>
      </div>
      <br/>

      {/* GIF */}
      {useGif &&
        <RandomGifComponent/>
      }

    </div>
  );
};

export default ConnectComponent;
