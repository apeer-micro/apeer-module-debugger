import React from 'react';
import path from 'path';

const fs = window.require('fs');

export default class ModuleSpecComponent extends React.Component {
  constructor(props) {
    super(props);
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
      let inputType = 'text';
      let multipleFile = false;

      switch (input.type) {
        case 'string':
          inputType = 'text';
          break;
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
      }

      return (
        <label className="text-white">
          {input.name}
          <input type={inputType} name={input.name} />
        </label>
      );
    });

    return <form>{spec}</form>;
  }

  render() {
    var form = this.createForm();
    return <React.Fragment>{form}</React.Fragment>;
  }
}
