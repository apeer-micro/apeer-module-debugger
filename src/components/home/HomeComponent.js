import React from 'react';

import './HomeComponent.css';
import logo from '../../assets/logo.svg';
const { exec } = window.require('child_process');

export default class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        <div className="header container ml-0">
          <div className="row">
            <div className="col pl-0">
              <img src={logo} alt="logo" className="pl-5 pt-5" />
            </div>
            <div className="col-9 pl-0">
              <h2 className="text-white pl-5 pt-4 mb-3 mt-3 module-name">
                {this.props.module.name}
              </h2>
            </div>
          </div>
          <div className="bottom-line" />
        </div>
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
