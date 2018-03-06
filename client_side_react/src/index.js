import ReactDOM from 'react-dom';
import React from 'react';

import LogIn from './LogIn';
import AppManager from './AppManager'

document.getElementById("sidebar").hidden = true;
ReactDOM.render(<AppManager />, document.getElementById("card"));
