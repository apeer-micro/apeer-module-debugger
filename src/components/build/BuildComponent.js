import React from 'react';
const { exec } = window.require('child_process');

export default class BuildComponent extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          build: this.props.build
      }
      this.onBuildButtonClick = this.onBuildButtonClick.bind(this);
  }

  onBuildButtonClick() {
    const dockerBuildCommand = `docker build -t ${this.props.module.name} .`;
    console.log('Docker Build Command', dockerBuildCommand);
    let buildState = Object.assign({}, this.state.build);
    buildState.inProgress = true;
    this.setState({build: buildState});
    this.props.onBuildChange(this.state.build);

    const child = exec(dockerBuildCommand, {
      async: true,
      cwd: this.props.module.path,
      maxBuffer: 2000 * 1024
    });

    child.stdout.on('data', data => {
      let buildState = Object.assign({}, this.state.build);
      buildState.log += `${data}\n`;
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
      } else {
        buildState.isSuccess = true;
        console.log('success');
      }

      buildState.inProgress = false;
      this.setState({build: buildState});
      this.props.onBuildChange(this.state.build);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="m-2 row">
          <button className="btn btn-light col-2 action-button" onClick={this.onBuildButtonClick}>
            Build
          </button>
          <pre className="text-white w-100 col">{this.state.build.log}</pre>
        </div>
      </React.Fragment>
    );
  }
}
