import React from 'react';
import CardClient from './CardClient.js';
// import config from './config';

var axios = require('axios');

class AppManager extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            metadata: null
        }
        
        this.makePostRequest = this.makePostRequest.bind(this);
    }
    
    makePostRequest(method, url, data, callBack) {
        axios({
            method: "post",
            url: url,
            data: data
        }).then((response) => {
            callBack(response);
        }).catch((error) => {
            console.log(error);
        });
    }
    
    componentDidMount() {
        
        this.makePostRequest(
            "post", "/read-card",
            { _id: "5a77c6d0734d1d3bd58d1198" },
            (response) => {
                var metadata = response["data"];
                this.setState({
                    metadata: metadata
                });
                console.log(metadata);
            }
        );
    }
    
    render() {
        return (
            <CardClient />
        )
    }
}

export default AppManager;
