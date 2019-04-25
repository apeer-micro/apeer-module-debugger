import React from 'react';
import ModuleSpecComponent from './module-spec/ModuleSpecComponent';

export default class RunComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buildStatus: this.props.buildState,
      run: this.props.run
    };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.buildStatus ? (
          <div className="m-2 row">
            <button className="btn btn-light col-2 action-button">Run</button>
            <div className="d-flex flex-column pl-4">
              <ModuleSpecComponent module={this.props.module}/>
              <pre className="text-white w-100 col">{this.state.run.Log}</pre>
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
