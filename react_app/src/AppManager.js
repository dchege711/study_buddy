import React from 'react';
import CardClient from './CardClient.js';
import ReactDOM from 'react-dom';

class AppManager extends React.Component {
    
    constructor(props) {
        super(props);
        // this.getMetaData = this.getMetaData.bind(this);
    }
    
    
    
    componentDidMount() {
        ReactDOM.render(<CardClient />, document.getElementById("card"));
    }
    
    render() {
        return (
            <p>This has been set by the App Manager :-)</p>
        )
    }
}

export default AppManager;
