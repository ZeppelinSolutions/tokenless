import React from 'react';

const FinishComponent = () => {
  return (
    <div className='panel panel-default'>
      <div className="panel-heading">
        <strong>This prediction has finished</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <div className="form-group">
            <h4 className="text-primary">
              This prediction has been resolved and all bets, prizes
              and fees have been withdrawn from the smart contract.
            </h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinishComponent;