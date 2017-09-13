import React from 'react';
import RandomGifComponent from '../../common/components/RandomGifComponent';

const NotFoundComponent = () => {
  return (
    <div className="container">
      <div className="text-center">
        <h2>404 Error</h2>
        Nothing to see here. Are you lost?
      </div>
      <br/>
      <RandomGifComponent tag="lost"/>
    </div>
  );
};

export default NotFoundComponent;