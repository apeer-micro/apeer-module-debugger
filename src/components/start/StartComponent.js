import './StartComponent.css';
import 'toastr/build/toastr.min.css';

import React from 'react';
import toastr from 'toastr';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import logo from '../../assets/logo.svg';
const styles = theme => ({
  main: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});

const { remote } = window.require('electron')
const fs = window.require('fs');
const path = window.require('path');

class StartComponent extends React.Component {
  constructor(props){
    super(props);
  }

  openFolder() {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
      let [moduleFolderPath] = result.filePaths;
      const files = fs.readdirSync(moduleFolderPath);
      let module = {
        name: path.basename(moduleFolderPath).toLowerCase(),
        path: moduleFolderPath,
        files: files
      };

      if (files.find(x => x === 'DockerFile' || x === 'module_specification.json')) {
        this.props.onModuleSelected(module)
      } else{
        setTimeout(() => toastr.error(`This is not a valid module folders`), 300);
      }
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <img className="logo" src={logo} alt="logo" />
        <h1 className="header-title">Module Debugger</h1>
        <h3 className="text-white pb-3">
         Open your module folder to start building!
        </h3>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => this.openFolder()}>
          Open Module Folder
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(StartComponent);
