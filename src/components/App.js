import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className="d-flex">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="text-white pl-2">Module Debugger</h2>
        </div>
      </div>
    );
  }
}

export default App;
