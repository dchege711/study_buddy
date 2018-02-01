import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './css/main.css';

import LogIn from './LogIn.js'

class App extends React.Component {
    state = {
        response: ""
    };
    
    componentDidMount() {
        this.callApi()
            .then(function(response) {
                this.setState({
                    response: response.express
                })
            ).catch(function(error) {
                console.log(error);
            })
    }
    
    callApi = async() => {
        const response = await fetch("/");
        const body = await response.json();
        if (response.status != 200) {
            throw Error(body.message);
        }
        return body;
    }
    
    render() {
        return(ReactDOM.render(<LogIn />, document.getElementById('root'));)
    }
}
