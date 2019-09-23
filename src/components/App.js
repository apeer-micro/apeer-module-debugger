import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

import theme from '../themes';
import HomeComponent from './home/HomeComponent';
import StartComponent from './start/StartComponent';

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {currentComponent}
      </ThemeProvider>
    );
  }
}

export default App;
