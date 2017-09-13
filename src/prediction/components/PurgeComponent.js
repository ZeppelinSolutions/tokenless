import React from 'react';

const PurgeComponent = ({ purgePrediction }) => {

  const handleButtonClick = function() {
    purgePrediction();
  };

  return (
    <div className='panel panel-danger'>
      <div className="panel-heading">
        <strong>You may purge this prediction</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <div className="form-group">
            <div className="text-primary">
              It appears that this prediction still retains a positive balance, even afer the withdrawal period has passed.
              Please consider waiting a bit longer for everyone to claim their funds or even try contacting them.
              However, as you are responsible for this prediction, you may claim the funds for yourself as of now, in order to avoid
              the funds becoming locked.
            </div>
            <br/>
            <div>
              <button
                type="button"
                className="btn btn-danger"
                onClick={(evt) => handleButtonClick()}>
                Purge the Contract
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurgeComponent;
