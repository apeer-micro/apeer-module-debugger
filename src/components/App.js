import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className="app-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Module Debugger</h2>
        </div>
        <p className="App-intro">
          This is module debugger!
        </p>
      </div>
    );
  }
}

export default App;
