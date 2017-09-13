import React from 'react';

const WaitComponent = () => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>Waiting...</strong>
      </div>
      <div className="panel-body">

        <h4>
          Waiting for the owner to resolve this prediction.
          This can happen any time now.
          Please come back to check if the prediction has been resolved, and most importantly,
          to see if you have a prize to claim!
        </h4>

      </div>
    </div>
  );
};

export default WaitComponent;
