import React from 'react';
import ReactDOM from 'react-dom';
import MongoDBClient from './MongoDBClient'

function UpdatedNavBar(props) {
    return (
        <div>
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
            <MongoDBClient />, document.getElementById("root")
        );    
    }
    
    render() {
        return UpdatedNavBar({});
    }
    
}

export default SuccessLogin;
