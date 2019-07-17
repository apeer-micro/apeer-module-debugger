import './HomeComponent.css';

import React from 'react';
import Stepper from 'react-stepper-horizontal';

import leftIcon from '../../assets/icons/left.svg';
import rightIcon from '../../assets/icons/right.svg';
import logo from '../../assets/logo.svg';
import BuildComponent from '../build/BuildComponent';
import RunComponent from '../run/RunComponent';

export default class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      build: {
        inProgress: false,
        log: '',
        isSuccess: null,
      },
      run:{
        inProgress: false,
        Log: '',
        isSuccess: null
      }
    };
    this.onBuildChange = this.onBuildChange.bind(this);
    this.onRunChange = this.onRunChange.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
  }

  onBuildChange(currentBuildState){
    this.setState({run: {inProgress: false, Log: '', isSuccess:null}});
    this.setState({build: currentBuildState});
  }

  onRunChange(currentRunState){
    this.setState({run: currentRunState});
  }

  onClickNext() {
    const currentStep = this.state.activeStep;
    if (currentStep === 0) {
      this.setState({ activeStep: 1 });
    }
  }

  onClickBack() {
    const currentStep = this.state.activeStep;
    if (currentStep === 1) {
      this.setState({ activeStep: 0 });
    }
  }

  render() {
    let spinner;
    if(this.state.build.inProgress){
      spinner = (<div className="spinner-grow text-primary ml-0 build-spinner" role="status" />);
    }
    if(this.state.run.inProgress) {
      spinner = (<div className="spinner-grow text-primary ml-0 run-spinner" role="status" />);
    }

    let currentTab;
    if (this.state.activeStep === 1) {
      currentTab = (
        <RunComponent buildState={this.state.build.isSuccess} run={this.state.run} module={this.props.module} onRunChange={this.onRunChange} />
      );
    } else {
      currentTab = (
        <BuildComponent build={this.state.build} module={this.props.module} onBuildChange={this.onBuildChange}/>
      );
    }

    return (
      <React.Fragment>
        <div className="header align-items-center d-flex">
          <img src={logo} alt="logo" className="ml-3" />
          <span className="text-white module-name ml-5">{this.props.module.name}</span>
          <div className="stepper-container">
            <Stepper
              activeColor="#008bd0"
              completeColor="white"
              circleFontSize={0}
              activeTitleColor="white"
              completeTitleColor="white"
              defaultTitleColor="white"
              completeBarColor="white"
              size={16}
              steps={[{ title: 'Build' }, { title: 'Run' }]}
              activeStep={this.state.activeStep}
            />
            {spinner}
            <button className="left-icon button-no-style" onClick={this.onClickBack} disabled={this.state.build.inProgress || this.state.run.inProgress}>
              <img src={leftIcon} alt="lefticon" />
            </button>
            <button className="right-icon button-no-style" onClick={this.onClickNext} disabled={this.state.build.inProgress || this.state.run.inProgress}>
              <img src={rightIcon} alt="righticon" />
            </button>
          </div>
        </div>
        <div className="bottom-line" />
        {currentTab}
      </React.Fragment>
    );
  }
}
