import ReactDOM from 'react-dom';
import React from 'react';

import LogIn from './LogIn';
import SideBarManager from './SideBarManager';

ReactDOM.render(<LogIn />, document.getElementById("card"));
ReactDOM.render(<SideBarManager />, document.getElementById("sidebar"));
