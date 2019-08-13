import './RunComponent.css';
import 'toastr/build/toastr.min.css';

import React from 'react';
import toastr from 'toastr';

import linkIcon from '../../assets/icons/link.svg';
import ModuleSpecComponent from './module-spec/ModuleSpecComponent';

const process = window.require('process');
const fs = window.require('fs-extra');
const path = window.require('path');
const { exec } = window.require('child_process');
const { shell } = window.require('electron');

export default class RunComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      run: this.props.run,
      outputFolder: path.join(this.props.module.path, 'output'),
      inputFolder: path.join(this.props.module.path, 'input')
    };

    this.onRunButtonClick = this.onRunButtonClick.bind(this);
    this.openOutputFolder = this.openOutputFolder.bind(this);
  }

  onRunButtonClick(inputs) {
    this.setState({ run: { inProgress: true, log: 'Running module ...\n', isSuccess: null } });
    this.props.onRunChange(this.state.run);
    console.dir(this.state.run);
    !fs.existsSync(this.state.inputFolder) && fs.mkdirSync(this.state.inputFolder);
    !fs.existsSync(this.state.outputFolder) && fs.mkdirSync(this.state.outputFolder);
    fs.emptyDir(this.state.outputFolder);

    let envVariable = '{"WFE_output_params_file":"wfe_module_params_1_1.json"';
    inputs.forEach(input => {
      switch (input.type) {
        case 'file':
          console.dir(input.value);
          var fullpath = input.value[0].path;
          var filename = path.basename(fullpath);
          envVariable += ',"' + input.name + '":"/input/' + filename + '"';
          var dest = path.join(this.state.inputFolder, filename).toString();
          if (!fs.existsSync(dest)) {
            fs.copyFileSync(fullpath, path.join(this.state.inputFolder, filename).toString());
          }
          break;
        case 'list[file]':
          envVariable += ',"' + input.name + '":[';
          [...input.value].forEach(f => {
            var fullpath = f.path;
            var filename = path.basename(fullpath);
            envVariable += '"/input/' + filename + '",';
            if (!fs.existsSync(dest)) {
              fs.copyFileSync(fullpath, path.join(this.state.inputFolder, filename).toString());
            }
          });
          envVariable = envVariable.replace(/,$/g, '');
          envVariable += ']';
          break;
        case 'string':
          envVariable += `,"${input.name}":"${input.value}"`;
          break;
        default:
          envVariable += `,"${input.name}":${input.value}`;
          break;
      }
    });

    envVariable += '}';
    let dockerRunCommand =
      'docker run -v ' +
      this.state.outputFolder +
      ':/output -v ' +
      this.state.inputFolder +
      ":/input:ro -e WFE_INPUT_JSON='" +
      envVariable +
      "' " +
      this.props.module.name;

    // if windows
    if (/^win/i.test(process.platform)) {
      console.dir("windows");
      dockerRunCommand = dockerRunCommand.replace(/\\([\s\S])|(")/g, '\\$1$2');
      dockerRunCommand = dockerRunCommand.replace(/'/g, '"'); // for windows replace single quote to double quotes
    }

    console.dir(dockerRunCommand);
    const child = exec(dockerRunCommand, {
      async: true,
      maxBuffer: 2000 * 1024,
      env: {
        shell: true
      }
    });

    child.stdout.on('data', data => {
      console.log(data);
      this.UpdateLog(data);
    });

    child.stderr.on('data', data => {
      console.log('error', data);
      this.UpdateLog(data);
    });

    child.on('exit', data => {
      console.log('exit', data);
      let runState = Object.assign({}, this.state.run);
      if (data == null || data !== 0) {
        runState.isSuccess = false;
        runState.log += 'module run failed';
        console.log('run failed');
        setTimeout(() => toastr.error(`Module run failed`), 300);
      } else {
        runState.isSuccess = true;
        runState.log += 'module ran successfully';
        console.log('run success');
        setTimeout(() => toastr.success(`Module ran successfully`), 300);
      }

      runState.inProgress = false;
      this.setState({ run: runState });
      this.props.onRunChange(this.state.run);
    });
  }

  UpdateLog(log) {
    let runState = Object.assign({}, this.state.run);
    runState.log += `${log}\n`;
    this.setState({ run: runState });
    this.props.onRunChange(this.state.run);
  }

  openOutputFolder() {
    console.dir(this.state.outputFolder);
    shell.openItem(this.state.outputFolder);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.buildState ? (
          <div className="d-flex m-4">
            <div className="run-inputs d-flex flex-column col-4">
              <ModuleSpecComponent
                module={this.props.module}
                disableRunButton = {this.state.run.inProgress}
                onRunButtonClick={this.onRunButtonClick}
              />
              <a className="mt-5" role="button" href="#" onClick={this.openOutputFolder}>
                Open Output Folder
                <img src={linkIcon} className="pl-2" alt="test"/>
              </a>
            </div>
            <div className="pl-3">
              {this.state.run.log === '' || !this.state.run.log ? (
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
