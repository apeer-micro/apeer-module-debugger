import React from 'react';
const { ipcRenderer } = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');

import './StartComponent.css';
import logo from '../../assets/logo.svg';

export default class StartComponent extends React.Component {
  constructor(props){
    super(props);
    this.folderSelected = this.folderSelected.bind(this);
    ipcRenderer.on('selected-folder', this.folderSelected);
  }

  openFolder() {
    ipcRenderer.send('open-folder');
  }

  folderSelected(event, paths) {
    let [moduleFolderPath] = paths;
    const files = fs.readdirSync(moduleFolderPath);
    let module = {
      name: path.basename(moduleFolderPath),
      path: moduleFolderPath,
      files: files
    };

    if (files.find(x => x === 'DockerFile' || x === 'module_specification.json')) {
      this.props.onModuleSelected(module)
    }
  }

  render() {
    return (
      <div className="d-flex justify-content-center text-center flex-column section-start">
        <div>
          <img src={logo} alt="logo" />
          <h2 className="text-white header-title">Module Debugger</h2>
        </div>
        <div className="d-flex flex-column mt-5">
          <span className="text-white pb-3">
            Start building modules by opening your module folder!
          </span>
          <button className="btn btn-light mx-auto" onClick={() => this.openFolder()}>
            Open Module Folder
          </button>
        </div>
      </div>
    );
  }
}
