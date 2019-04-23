import React from 'react';
import Stepper from 'react-js-stepper';

import './HomeComponent.css';
import logo from '../../assets/logo_gradient_blue_bg.svg';
const { exec } = window.require('child_process');

const steps = [{ title: 'Build' }, { title: 'Run' }];

export default class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
      isBuilding: false,
      buildLog: '',
      isBuildSuccess: null,
      isRunning: false,
      runLog: '',
      isRunSuccess: null
    };
    this.onBuildButtonClick = this.onBuildButtonClick.bind(this);
    this.onRunTabClick = this.onRunTabClick.bind(this);
  }

  handleOnClickStepper = step => {
    this.setState({ activeStep: step });
  };

  handleOnClickNext = () => {
    let nextStep = this.state.activeStep + 1;
    this.setState({ activeStep: nextStep });
  };

  handleOnClickBack = () => {
    let prevStep = this.state.activeStep - 1;
    this.setState({ activeStep: prevStep });
  };

  onBuildButtonClick() {
    console.log('build');
    let buildModuleLog = '';
    const dockerBuildCommand = `docker build -t ${this.props.module.name} .`;
    console.log('Docker Build Command', dockerBuildCommand);

    const child = exec(dockerBuildCommand, {
      async: true,
      cwd: this.props.module.path,
      maxBuffer: 2000 * 1024
    });

    child.stdout.on('data', data => {
      buildModuleLog += data;
      this.setState({ isBuilding: true, buildLog: buildModuleLog });
    });

    child.stderr.on('data', data => {
      console.error('error', data);
      buildModuleLog += data;
      this.setState({ isBuilding: false, buildLog: buildModuleLog });
    });

    child.on('exit', data => {
      console.log('exit', data);
      this.setState({ isBuilding: false });
      if (data == null || data !== 0) {
        console.log('build failed');
      } else {
        console.log('success');
      }
    });
  }

  onRunTabClick() {
    console.log('run');
  }

  render() {
    return (
      <div>
        <div className="header align-items-center d-flex">
          <img src={logo} alt="logo" className="ml-3" />
          <span className="text-white module-name ml-5">{this.props.module.name}</span>
          <Stepper 
            steps={steps}
            activeStep={this.state.activeStep}
            onSelect={this.handleOnClickStepper}
            showNumber={false}
          />
        </div>
        <div className="bottom-line" />
        <div className="m-2 d-flex">
          <button className="btn btn-light mb-auto" onClick={this.onBuildButtonClick}>
            Build
          </button>
          <pre className="text-white w-100 ml-3">{this.state.buildLog}</pre>
        </div>
      </div>
    );
  }
}
