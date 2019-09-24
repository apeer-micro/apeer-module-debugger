import 'toastr/build/toastr.min.css';
import React from 'react';
import toastr from 'toastr';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

const { exec } = window.require('child_process');

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },

  console: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(1),
  },

  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  pre: {
    whiteSpace: 'pre-wrap'
  }
});

class BuildComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      build: this.props.build,
    };
    this.onBuildButtonClick = this.onBuildButtonClick.bind(this);
  }

  onBuildButtonClick() {
    const dockerBuildCommand = `docker build -t ${this.props.module.name} .`;
    console.log('Docker Build Command', dockerBuildCommand);
    this.setState({ build: { inProgress: true, isSuccess: null, log: `Building module ...\n`} });
    this.props.onBuildChange(this.state.build);

    const child = exec(dockerBuildCommand, {
      async: true,
      cwd: this.props.module.path,
      maxBuffer: 2000 * 1024,
      env: {
        shell: true
      }
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
    const classes = this.props.classes

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.onBuildButtonClick}
          disabled={this.state.build.inProgress}>
          Build
        </Button>

        <Fab
          variant="extended"
          color="primary"
          onClick={this.onBuildButtonClick}
          disabled={this.state.build.inProgress}
          className={classes.fab}>
          Build
        </Fab>

        <Paper className={classes.console}>
          <Typography variant="h5" component="h3">
            Build Output
          </Typography>
          {this.state.build.log === '' || !this.state.build.log ? (
            <Typography component="p">
              To build module and see the build logs, click on Build
            </Typography>
          ) : (
            <pre className={classes.pre}>{this.state.build.log}</pre>
          )}
        </Paper>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(BuildComponent);