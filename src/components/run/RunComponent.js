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
            <div className="d-flex flex-column m-3">
              <h3 className="text-white">Module Inputs:</h3>
              <ModuleSpecComponent module={this.props.module} />
              <div className="mt-5">
                <h3 className="text-white">Module Logs:</h3>
                {this.state.run.inProgress == false || this.state.run.isSuccess !== null ? (
                  <span className="text-white">
                    To see module, select the module inputs and click on run
                  </span>
                ) : (
                  ''
                )}
                <pre className="text-white w-100">{this.state.run.Log}</pre>
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
