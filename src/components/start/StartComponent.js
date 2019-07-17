import './StartComponent.css';
import 'toastr/build/toastr.min.css';

import React from 'react';
import toastr from 'toastr';

import logo from '../../assets/logo.svg';

const { ipcRenderer } = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');

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
    } else{
      setTimeout(() => toastr.error(`This is not a valid module folders`), 300);
    }
  }

  render() {
    return (
      <div className="d-flex justify-content-center text-center flex-column section-start">
        <div>
          <img className="logo" src={logo} alt="logo" />
          <h1 className="text-white header-title">Module Debugger</h1>
        </div>
        <div className="d-flex flex-column mt-5">
          <h3 className="text-white pb-3">
           Open your module folder to start building!
          </h3>
          <button className="btn btn-light mx-auto" onClick={() => this.openFolder()}>
            Open Module Folder
          </button>
        </div>
      </div>
    );
  }
}
