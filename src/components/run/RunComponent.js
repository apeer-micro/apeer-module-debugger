import React from 'react';
import ModuleSpecComponent from './module-spec/ModuleSpecComponent';

export default class RunComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buildStatus: this.props.buildState,
      run: this.props.run
    };

    this.onRunButtonClick = this.onRunButtonClick.bind(this);
  }

  onRunButtonClick(){
    console.dir("inputs");
  }

  render() {
    return (
      <React.Fragment>
        {this.state.buildStatus ? (
          <div className="d-flex m-4">
            <div>
              <ModuleSpecComponent module={this.props.module} onRunButtonClick={this.onRunButtonClick}/>
            </div>
            <div className="pl-3">
                {this.state.run.inProgress === false || this.state.run.isSuccess !== null ? (
                  <span className="text-white">
                    To see module run logs, select the module inputs and click on run
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
