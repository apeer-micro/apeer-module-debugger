import 'toastr/build/toastr.min.css';

import React from 'react';
import toastr from 'toastr';

const { exec } = window.require('child_process');

export default class BuildComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      build: this.props.build
    };
    this.onBuildButtonClick = this.onBuildButtonClick.bind(this);
  }

  onBuildButtonClick() {
    const dockerBuildCommand = `docker build -t ${this.props.module.name} .`;
    console.log('Docker Build Command', dockerBuildCommand);
    this.setState({ build: { inProgress: true, log: '', isSuccess: null } });
    this.props.onBuildChange(this.state.build);

    const child = exec(dockerBuildCommand, {
      async: true,
      cwd: this.props.module.path,
      maxBuffer: 2000 * 1024
    });

    child.stdout.on('data', data => {
      let buildState = Object.assign({}, this.state.build);
      buildState.log += `${data}`;
      this.setState({ build: buildState });
      this.props.onBuildChange(this.state.build);
    });

    child.stderr.on('data', data => {
      console.error('error', data);
      let buildState = Object.assign({}, this.state.build);
      buildState.log += `${data}\n`;
      this.setState({ build: buildState });
      this.props.onBuildChange(this.state.build);
    });

    child.on('exit', data => {
      console.log('exit', data);
      let buildState = Object.assign({}, this.state.build);
      if (data == null || data !== 0) {
        buildState.isSuccess = false;
        console.log('build failed');
        setTimeout(() => toastr.error(`Module build failed`), 300);
      } else {
        buildState.isSuccess = true;
        console.log('build success');
        setTimeout(() => toastr.success(`Module successfully built`), 300);
      }

      buildState.inProgress = false;
      this.setState({ build: buildState });
      this.props.onBuildChange(this.state.build);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="m-2 row">
          <button
            className="btn btn-primary col-2 action-button"
            onClick={this.onBuildButtonClick}
            disabled={this.state.build.inProgress}
          >
            Build
          </button>
          <div className="col">
            {this.state.build.log === '' || !this.state.build.log ? (
              <span className="text-white">
                To build module and see the build logs, click on Build
              </span>
            ) : (
              <pre className="text-white w-100">{this.state.build.log}</pre>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
