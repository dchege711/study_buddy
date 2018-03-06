import ReactDOM from 'react-dom';
import React from 'react';

import LogIn from './LogIn';

document.getElementById("sidebar").hidden = true;
ReactDOM.render(<LogIn />, document.getElementById("card"));
