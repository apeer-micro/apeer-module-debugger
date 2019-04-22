import React, { Component } from 'react';
import './App.css';

import StartComponent from './start/StartComponent';
import HomeComponent from './home/HomeComponent';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      step: 0,
      module: {
        name: null,
        path: null,
        files: null,
      },
    };
    this.onModuleSelected = this.onModuleSelected.bind(this);
  }

  onModuleSelected(selectedModule) {
    this.setState({step: 1, module: selectedModule});
  }

  render() {
    const step = this.state.step;
    let currentComponent = (<StartComponent onModuleSelected={this.onModuleSelected} />);
    if(step === 1) {
      console.dir(this.state.module);
      currentComponent = (<HomeComponent module={this.state.module}/>);
    }

    return (
      <div>
       {currentComponent}
      </div>
    );
  }
}

export default App;
