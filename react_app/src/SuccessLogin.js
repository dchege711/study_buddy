import React from 'react';
import ReactDOM from 'react-dom';
import CardClient from './CardClient'

function UpdatedNavBar(props) {
    return (
        <div className="topnav study-buddy-theme-color">
            <li><a href="/">Welcome to Study Buddy!</a> </li>
            <li><a href="/">View Previous Gems</a> </li>
            <li><a href="/">Add a Gem</a> </li>
        </div>
    )
}


class SuccessLogin extends React.Component {
    
    constructor(props) {
        super(props);
        ReactDOM.render(
            <UpdatedNavBar />, document.getElementById("topnavitems")
        );
        
        ReactDOM.render(
            <CardClient />, document.getElementById("root")
        );    
    }
    
    render() {
        return UpdatedNavBar({});
    }
    
}

export default SuccessLogin;
