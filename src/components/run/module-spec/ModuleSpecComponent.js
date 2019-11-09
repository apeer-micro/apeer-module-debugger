import 'toastr/build/toastr.min.css';

import { FormHelperText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import path from 'path';
import React from 'react';
import toastr from 'toastr';

const fs = window.require('fs');

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },

  main: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(1),
  },

  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2)
  }
});

//Module spec
class ModuleSpecComponent extends React.Component {
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
        default: json.spec.inputs[x].default,
        type: Object.keys(json.spec.inputs[x])[0].replace(/^type:/g, '')
      };
    });
    return inputs;
  }

  createForm() {
    const { classes } = this.props;

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
        <FormControl className={classes.formControl}>
          <InputLabel shrink={true} htmlFor={input.name}>{input.name}</InputLabel>
          {inputType === 'file' ? (
            <Input
              type={inputType}
              name={input.name}
              id={input.name}
              inputProps={{ multiple: multipleFile }}
              required
            />
          ) : (
            <Input
              type={inputType}
              name={input.name}
              id={input.name}
              value={input.default}
              required
            />
          )}
          <FormHelperText>Input Required</FormHelperText>
        </FormControl>
      );
    });

    return (
      <React.Fragment>
        <form>
          {spec}

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.onClick}
            disabled={this.props.disableRunButton}>
            Run
          </Button>
        </form>
      </React.Fragment>
    );
  }

  render() {
    var form = this.createForm();
    return <React.Fragment>{form}</React.Fragment>;
  }
}

export default withStyles(styles)(ModuleSpecComponent);
