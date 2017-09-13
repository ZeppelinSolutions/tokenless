import React from 'react';

const ResolveComponent = ({ resolvePrediction }) => {

  const handleResolveButtonClick = function(outcome) {
    resolvePrediction(outcome);
  };

  return (
    <div className='panel panel-danger'>
      <div className="panel-heading">
        <strong>You may resolve this prediction now</strong>
      </div>
      <div className="panel-body">
        <form className="">
          <button
            type="button"
            className="btn btn-info"
            onClick={(evt) => handleResolveButtonClick(true)}>
            Did Happen
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-danger"
            onClick={(evt) => handleResolveButtonClick(false)}>
            Didn't Happen
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResolveComponent;
