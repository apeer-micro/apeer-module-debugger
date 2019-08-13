import './ModuleSpecComponent.css';
import 'toastr/build/toastr.min.css';

import path from 'path';
import React from 'react';
import toastr from 'toastr';

const fs = window.require('fs');

//Module spec
export default class ModuleSpecComponent extends React.Component {
  constructor(props) {
    super(props);
    let inputs = this.setupInputs();
    this.state = {
      inputs: inputs
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const inputs = this.state.inputs.map(input => {
      let value;
      switch (input.type) {
        case 'file':
        case 'list[file]':
          value = document.getElementById(input.name).files;
          break;
        default:
          value = document.getElementById(input.name).value;
      }
      return {
        name: input.name,
        type: input.type,
        value: value
      };
    });

    console.dir(inputs);
    if (inputs.find(x => x.value === '')) {
      setTimeout(() => toastr.error(`Select all the inputs to run the module`), 300);
    } else {
      this.props.onRunButtonClick(inputs);
    }
  }

  setupInputs() {
    var specFile = path.join(this.props.module.path, 'module_specification.json');
    let rawData = fs.readFileSync(specFile);
    let json = JSON.parse(rawData);
    var keys = Object.keys(json.spec.inputs);
    const inputs = keys.map(x => {
      return {
        name: x,
        type: Object.keys(json.spec.inputs[x])[0].replace(/^type:/g, '')
      };
    });
    return inputs;
  }

  createForm() {
    let spec = this.state.inputs.map((input, i) => {
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
            <div className="input-group">
              <input
                type={inputType}
                name={input.name}
                id={input.name}
                multiple={multipleFile}
                className="form-control-file text-white"
                required
              />
              <div className="invalid-feedback">Input required</div>
            </div>
          ) : (
            <div className="input-group">
              <input
                type={inputType}
                name={input.name}
                id={input.name}
                className="form-control"
                required
              />
              <div className="invalid-feedback">Input required</div>
            </div>
          )}
        </div>
      );
    });

    return (
      <React.Fragment>
        <form className="d-flex flex-column module-inputs">
          {spec}
          <button type="button" className="btn btn-primary mt-5 btn-run" onClick={this.onClick} disabled={this.props.disableRunButton}>
            Run
          </button>
        </form>
      </React.Fragment>
    );
  }

  render() {
    var form = this.createForm();
    return <React.Fragment>{form}</React.Fragment>;
  }
}
