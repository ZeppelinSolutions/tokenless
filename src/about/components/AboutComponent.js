import React, { Component } from 'react';

class AboutComponent extends Component {
  render() {
    return(
      <div>

        <div className="container">

          {/* WHAT IS */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>What is tokenless.pm?</strong>
            </div>
            <div className="panel-body">
              Tokenless Prediction Market is a simple decentralized prediction market experiment, running on the Ethereum blockchain.
              Anyone can create a prediction, and anyone can bet on it choosing a simple yes/no outcome. When a prediction is resolved,
              all players can withdraw their prizes from it, and the author of the prediction can claim a small fee. Thats it. No tokens, no unnecessary
              complexity, just simple predictions. A small demonstration of how easily a small dapp be built.
            </div>
          </div>

          {/* HOW TO PLAY  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>How to play?</strong>
            </div>
            <div className="panel-body">
              In the "Create a Prediction" section, give your prediction a clear statement. Make sure that it properly defines an event that
              can be solved to yes or no, at a particular point in time. You can specify a date in which the prediction is to be resolved. Upon this date, you
              will be able to resolve the prediction, and other players will
              no longer be able to place bets on it any more. Finally, define the withdrawal period, which determines the amount of time players have from the
              moment of resolution to withdraw their prizes. The prediction owner can also retrieve his fees during this period.
              After this period expired, the owner will be able to withdraw the totality of the balance of the prediction. This is a security mechanism
              to ensure that no funds get stuck in the contract.<br/>
              As a player, you can select any prediction and place bets on it for the yes/no outcomes. You will be able to track your bets and see other people's bets. Once the
              owner of the prediction resolves it, you will be able to withdraw your prize (if you have one).<br/>
            </div>
          </div>

          {/* RULES  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Rules</strong>
            </div>
            <div className="panel-body">
              The following set of rules are enforced by the smart contracts:
              <ul>
                <li>Owners cannot bet on their own predictions.</li>
                <li>No one can destroy a prediction.</li>
                <li>Players can bet both positively and negatively on any prediction. The contract will track a separate pair of balances for each player.</li>
                <li>Owners can resolve the prediction to yes/no after the bet end date.</li>
                <li>The resolution of a prediction cannot be retracted.</li>
                <li>A bet by a player cannot be retracted.</li>
                <li>The withdrawal period starts as soon as the owner of a prediction resolves it.</li>
                <li>During the withdrawal period players can claim prizes and owners can claim fees.</li>
                <li>After the withdrawal perios, owners can purge predictions, claiming whatever no one else claimed.</li>
              </ul>
            </div>
          </div>

          {/* PRIZES & FEES  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Prizes and Fees</strong>
            </div>
            <div className="panel-body">
              When a prediction is resolved, it will have a pair of global positive and negative balances composed of all the positive and negative bets added together.
              Depending on the resolved outcome, one of these 2 pots will be a winning pot and the other a losing pot. All funds in the winning pot
              will be withdrawable by its funders. The losing pot will also be withdrawable by the winners, by an amount depending on the fraction of the winning pot they represented.
              For example, if you bet 1 eth on yes and that represents 1% of the winning pot, and the losing pot adds up to 200 eth, then you will be able
              to claim your original 1 eth back, as well as 1% of the 200 eth from the losing pot, totalling 3 eth. Is that it? Yes and no. Well, almost, there is a small percentage fee that is left behind in the
              contract for the owner of the prediction to claim, usually around 2%.
            </div>
          </div>

          {/* UNDER THE HOOD  */}
          <div className='panel panel-default'>
            <div className="panel-heading">
              <strong>Under the Hood</strong>
            </div>
            <div className="panel-body">
              All blockchain side logic is controlled by 2 smart contracts: 1) A single PredictionMarket contract 2) and many Predictions contracts. When a player creates a Prediction,
              he interacts with the PredictionMarket, which enforces a set of conditions to ensure the proper creation of a Prediction contract.
              Once this happens succesfully, a new smart contract will exist and everyone will be able
              to interact with it. The PredictionMarket will be able to keep track of it. For more
              details you can see the code of the smart contracts in the github link in the footer of this page.
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default AboutComponent;
