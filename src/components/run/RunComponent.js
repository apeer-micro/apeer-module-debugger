import 'toastr/build/toastr.min.css';

import { Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import toastr from 'toastr';

import linkIcon from '../../assets/icons/link.svg';
import ModuleSpecComponent from './module-spec/ModuleSpecComponent';

const process = window.require('process');
const fs = window.require('fs-extra');
const path = window.require('path');
const { exec } = window.require('child_process');
const { shell } = window.require('electron');

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },

  main: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(1),
  },

  pre: {
    whiteSpace: 'pre-wrap'
  }
});

class RunComponent extends React.Component {
  constructor(props) {
    super(props);
    let json = '';
    let specError = '';
    try {
      var specFile = path.join(this.props.module.path, 'module_specification.json');
      let rawData = fs.readFileSync(specFile);
      json = JSON.parse(rawData);
    }
    catch (e) {
      specError = e;
    }

    this.state = {
      run: this.props.run,
      outputFolder: path.join(this.props.module.path, 'output'),
      inputFolder: path.join(this.props.module.path, 'input'),
      json: json,
      specError: specError
    };

    this.onRunButtonClick = this.onRunButtonClick.bind(this);
    this.openOutputFolder = this.openOutputFolder.bind(this);
    this.checkOutputValues = this.checkOutputValues.bind(this);
  }


  checkOutputValues() {
    // check apeer_main.py and module_specification
    const files = fs.readdirSync(this.props.module.path);
    const errors = [];
    if (!files.find(x => x === 'apeer_main.py')) {
      console.warn("cannot check output values");
      return;
    }

    var keys = Object.keys(this.state.json.spec.outputs);
    const main_file = `${this.props.module.path}/apeer_main.py`;
    const data = fs.readFileSync(main_file, "utf8");
    const allLines = data.toString().split(/\r\n|\n/);
    allLines.forEach(line => {
      const index = line.indexOf("adk.set_file_output(");
      if (index != -1) {
        let code_output = line.split(/adk.set_file_output\((.*?),/)[1];
        code_output = code_output.substring(1, code_output.length-1);
        if(!keys.find(o => o === code_output)){
          console.error(`output ${code_output} not found is module specification`);
          errors.push(`output ${code_output} not found in module specification`)
        }
      }
    });

    return errors;
  }


  onRunButtonClick(inputs) {
    this.setState({ run: { inProgress: true, log: 'Comparing module output defined in specification file and in apeer_main.py... ', isSuccess: null } });
    const errors = this.checkOutputValues();
    if(errors.length > 0){
      this.setState({ run: { inProgress: false, log: `Module run failed`, isSuccess: false } });
      setTimeout(() => toastr.error(`Module run failed`), 300);
      return;
    }

    this.setState({ run: { inProgress: true, log: 'Module outputs are same\n', isSuccess: null } });
    this.setState({ run: { inProgress: true, log: 'Running module ...\n', isSuccess: null } });
    this.props.onRunChange(this.state.run);
    !fs.existsSync(this.state.inputFolder) && fs.mkdirSync(this.state.inputFolder);
    !fs.existsSync(this.state.outputFolder) && fs.mkdirSync(this.state.outputFolder);
    fs.emptyDir(this.state.outputFolder);

    let envVariable = '{"WFE_output_params_file":"wfe_module_params_1_1.json"';
    inputs.forEach(input => {
      switch (input.type) {
        case 'file':
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
        case 'choice_binary':
        case 'number':
        case 'integer':
          envVariable += `,"${input.name}":${input.value}`;
          break;
        case 'string':
          envVariable += `,"${input.name}":"${input.value}"`;
          break;
        default:
          envVariable += `,"${input.name}":"${input.value}"`;
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
    const { classes } = this.props;
    var body;

    if (this.props.buildState) {
      if (this.state.json !== '') {
        body = (
          <div>
            <ModuleSpecComponent
              json={this.state.json}
              disableRunButton={this.state.run.inProgress}
              onRunButtonClick={this.onRunButtonClick}
            />
            <div>
              <Link variant="body1" href="#" onClick={this.openOutputFolder}>
                Open Output Folder
                &nbsp;
                <img src={linkIcon} className="pl-2" alt="test" />
              </Link>

              {this.state.run.log === '' || !this.state.run.log ? (
                <Typography variant='body1'>
                  To see module run logs, select the module inputs and click on run
                </Typography>
              ) : (
                  ''
                )}
            </div>
            <pre className={classes.pre}>{this.state.run.log}</pre>
          </div>
        );
      }
      else {
        body = (
          <React.Fragment>
            <span>Error in module specification file, Please rebuild the module after fixing it</span>
            <pre className={classes.pre}>{this.state.specError.message}</pre>
            <pre className={classes.pre}>{this.state.specError.stack}</pre>
          </React.Fragment>
        );
      }
    }
    else {
      body = (
        <span className="text-white m-2 row">
          Build the module successfully to start running it.
      </span>
      );
    }

    return (
      <Paper className={classes.main}>
        {body}
      </Paper>
    );
  }
}

export default withStyles(styles)(RunComponent);
