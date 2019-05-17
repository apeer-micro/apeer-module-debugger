import React from 'react';
const fs = window.require('fs-extra');
const path = window.require('path');
const { exec } = window.require('child_process');

import './RunComponent.css';
import ModuleSpecComponent from './module-spec/ModuleSpecComponent';

export default class RunComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      run: this.props.run
    };

    this.onRunButtonClick = this.onRunButtonClick.bind(this);
  }

  onRunButtonClick(inputs) {
    console.dir(inputs);
    const inputFolder = path.join(this.props.module.path, 'input');
    const outputFolder = path.join(this.props.module.path, 'output');
    !fs.existsSync(inputFolder) && fs.mkdirSync(inputFolder);
    !fs.existsSync(outputFolder) && fs.mkdirSync(outputFolder);
    fs.emptyDir(outputFolder);

    let envVariable = '{"WFE_output_params_file":"wfe_module_params_1_1.json"';
    inputs.forEach(input => {
      switch (input.type) {
        case 'file':
          console.dir(input.value);
          var fullpath = input.value[0].path;
          var filename = path.basename(fullpath);
          envVariable += ',"' + input.name + '":' + '"/input/' + filename + '"';
          fs.copyFileSync(fullpath, path.join(inputFolder, filename).toString());
          break;
        case 'list[file]':
          envVariable += ',"' + input.name + '":[';
          [...input.value].forEach(f => {
            var fullpath = f.path;
            var filename = path.basename(fullpath);
            envVariable += '"/input/' + filename + '",';
            fs.copyFileSync(fullpath, path.join(inputFolder, filename).toString());
          });
          envVariable = envVariable.replace(/,$/g, '');
          envVariable += ']';
          break;
        default:
          envVariable += ',"' + input.name + '":' + input.value;
          break;
      }
    });

    envVariable += '}';
    let dockerRunCommand =
      'docker run -v ' +
      outputFolder +
      ':/output -v ' +
      inputFolder +
      ":/input:ro -e WFE_INPUT_JSON='" +
      envVariable +
      "' " +
      this.props.module.name;

    // if windows
    if (/^win/i.test(process.platform)) {
      dockerRunCommand = dockerRunCommand.replace(/\\([\s\S])|(")/g,"\\$1$2");
      dockerRunCommand = dockerRunCommand.replace(/'/g, '"'); // for windows replace single quote to double quotes
    }

    console.dir(dockerRunCommand);
    this.setState({ run: { inProgress: true, log: '', isSuccess: null } });

    const child = exec(dockerRunCommand, {
      async: true,
      maxBuffer: 2000 * 1024
    });

    child.stdout.on('data', data => {
      console.log(data);
      let runState = Object.assign({}, this.state.run);
      runState.log += `${data}\n`;
      this.setState({ run: runState });
      this.props.onRunChange(this.state.run);
    });

    child.stderr.on('data', data => {
      console.log('error', data);
      let runState = Object.assign({}, this.state.run);
      runState.log += `${data}\n`;
      this.setState({ run: runState });
      this.props.onRunChange(this.state.run);
    });

    child.on('exit', data => {
      console.log('exit', data);
      let runState = Object.assign({}, this.state.run);
      if (data == null || data !== 0) {
        runState.isSuccess = false; 
        runState.log += "module run failed";
        console.log('run failed');
      } else {
        runState.isSuccess = true;
        runState.log += "module ran successfully";
        console.log('run success');
      }

      runState.inProgress = false;
      this.setState({ run: runState });
      this.props.onRunChange(this.state.run);
    });
  }

  render() {
    return (
      <React.Fragment>
        {(this.props.buildState) ? (
          <div className="d-flex m-4">
            <div className="run-inputs col-4">
              <ModuleSpecComponent
                module={this.props.module}
                onRunButtonClick={this.onRunButtonClick}
              />
            </div>
            <div className="pl-3">
              {(this.state.run.log === '' || !this.state.run.log) ? (
                <span className="text-white">
                  To see module run logs, select the module inputs and click on run
                </span>
              ) : (
                ''
              )}
              <pre className="text-white w-100 run-log">{this.state.run.log}</pre>
            </div>
          </div>
        ) : (
          <span className="text-white m-2 row">
            Build the module successfully to start running it.
          </span>
        )}
      </React.Fragment>
    );
  }
}
