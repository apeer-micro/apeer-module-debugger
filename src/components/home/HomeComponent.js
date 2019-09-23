import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import logo from '../../assets/logo.svg';
import BuildComponent from '../build/BuildComponent';
import RunComponent from '../run/RunComponent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  logo: {
    paddingRight: theme.spacing(2),
  },

  spacer: {
    flexGrow: 1
  },

  toolbar: {
    height: '108px',
  }
});

class HomeComponent extends React.Component {
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
        log: '',
        isSuccess: null
      }
    };
    this.onBuildChange = this.onBuildChange.bind(this);
    this.onRunChange = this.onRunChange.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.onStepChange = this.onStepChange.bind(this);
  }

  onBuildChange(currentBuildState){
    this.setState({run: {inProgress: false, log: '', isSuccess:null}});
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

  onStepChange(event) {
    console.log(event);
  }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

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
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar}>
            <img src={logo} alt="logo" className={classes.logo} />
            <div className={classes.spacer}>
              {this.props.module.name}
            </div>
            <Stepper alternativeLabel nonLinear activeStep={activeStep}>
              <Step>
                <StepButton onClick={this.onClickBack}>
                  Build
                </StepButton>
              </Step>

              <Step>
                <StepButton onClick={this.onClickNext}>
                  Run
                </StepButton>
              </Step>
            </Stepper>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar} />

        {spinner}
        {currentTab}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(HomeComponent);