import React from 'react';
import path from 'path';
const fs = window.require('fs');

import './ModuleSpecComponent.css';

//Module spec
export default class ModuleSpecComponent extends React.Component {
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onRunButtonClick();
  }

  createForm() {
    var specFile = path.join(this.props.module.path, 'module_specification.json');
    let rawData = fs.readFileSync(specFile);
    let json = JSON.parse(rawData);
    var keys = Object.keys(json.spec.inputs);

    let spec = keys.map((x, i) => {
      var input = {
        name: x,
        type: Object.keys(json.spec.inputs[x])[0].replace(/^type:/g, '')
      };
      let inputType;
      let multipleFile = false;

      switch (input.type) {
        case 'file':
          inputType = 'file';
          break;
        case 'list[file]':
          inputType = 'file';
          multipleFile = true;
          break;
        case 'integer':
        case 'number':
          inputType = 'number';
          break;
        case 'string':
        default:
          inputType = 'text';
          break;
      }

      return (
        <div className="form-group" key={input.name}>
          <label className="text-white">{input.name}</label>
          {inputType === 'file' ? (
            <input
              type={inputType}
              name={input.name}
              id={input.name}
              multiple={multipleFile}
              className="form-control-file text-white"
            />
          ) : (
            <input type={inputType} name={input.name} id={input.name} className="form-control" />
          )}
        </div>
      );
    });

    return (
      <React.Fragment>
        <form className="d-flex flex-column module-inputs">{spec}</form>
        <button className="btn btn-primary mt-5 btn-run" onClick={this.onClick}>Run</button>
      </React.Fragment>
    );
  }

  render() {
    var form = this.createForm();
    return <React.Fragment>{form}</React.Fragment>;
  }
}
