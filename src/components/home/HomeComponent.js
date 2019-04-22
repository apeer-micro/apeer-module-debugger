import React from 'react';

import './HomeComponent.css';
import logo from '../../assets/logo.svg';

export default class HomeComponent extends React.Component {
  render() {
    return (
      <div>
        <div className="header container ml-0">
          <div className="row">
            <div className="col pl-0">
              <img src={logo} alt="logo" className="pl-5 pt-5" />
            </div>
            <div className="col-9 pl-0">
              <h2 className="text-white pt-4 mb-0 mt-3 module-name">{this.props.module.name}</h2>
            </div>
          </div>
        </div>
        <div className="bottom-line" />
        <div className="container ml-0">
          <div className="row">
            <div className="col pl-0">
              <button className="w-100 sidebar-button">Build</button>
              <button className="w-100 sidebar-button">Run</button>
            </div>
            <div className="col-9">
              <span className="text-white">Home</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
