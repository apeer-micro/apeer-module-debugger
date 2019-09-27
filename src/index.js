import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import toastr from 'toastr';

toastr.options.positionClass = 'toast-bottom-full-width';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
