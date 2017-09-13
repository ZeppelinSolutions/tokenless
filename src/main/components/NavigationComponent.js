import React from 'react';
import { Link } from 'react-router';
import * as info from '../../../package.json';
import {
  PATH_CREATE,
  PATH_ROOT,
  PATH_ABOUT, SHOW_VERSION
} from '../../constants';

const NavigationComponent = ({ path }) => {
  return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">

          {/* BRAND */}
          <div className="navbar-header">
            <div className="navbar-brand">
              <div className="brand">
                <span className='icon'>
                  <svg width="14" height="14" viewBox="0 2 24 24">
                    <path d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z"></path>
                  </svg>
                </span>
                <span>tokenless.pm</span>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="navbar-collapse collapse">

            {/* NAV ITEMS (LEFT) */}
            <ul className="nav navbar-nav">

              {/* PREDICTION LIST */}
              <li className={`${path === PATH_ROOT ? 'active' : ''}`}>
                <Link to={PATH_ROOT}>Browse Predictions</Link>
              </li>

              {/* CREATE PREDICTION */}
              <li className={path === PATH_CREATE ? 'active' : ''}>
                <Link to={PATH_CREATE}>Create a Prediction</Link>
              </li>

              {/* ABOUT */}
              <li className={path === PATH_ABOUT ? 'active' : ''}>
                <Link to={PATH_ABOUT}>About</Link>
              </li>

            </ul>

            {/* NAV ITEMS (RIGHT) */}
            <ul className="nav navbar-nav navbar-right">

              {/* VERSION */}
              {SHOW_VERSION &&
                <li>
                  <a> v{info.version}</a>
                </li>
              }

            </ul>

          </div>

        </div>
      </nav>
    </div>
  );
};

export default NavigationComponent;
