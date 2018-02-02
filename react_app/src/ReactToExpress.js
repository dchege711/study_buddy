import React from 'react';
import './css/main.css';

class ReactToExpress extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            url: "/"
        }
        this.getDataFromURL = this.getDataFromURL.bind(this);
    }
    
    getDataFromURL = (url, query, callBack) => {
        this.setState({
            url: url 
        });
        this.callApi()
            .then(function(responseData) {
                callBack(responseData);
            }).catch(function(error) {
                console.log(error);
            });
    }
    
    postDataToURL(url, data, callBack) {
        this.setState({
            url: url 
        });
        this.callApi()
            .then(function(responseData) {
                callBack(responseData);
            }).catch(function(error) {
                console.log(error);
            });
    }
    
    callApi = async() => {
        const response = await fetch(this.state.url);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

}

export default ReactToExpress;
