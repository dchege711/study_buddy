import React from 'react';
import ReactDOM from 'react-dom';
import AppManager from './AppManager'
import SignUpPage from './models/SignUpPage'
import LogInPage from './models/LogInPage'
import FailedLogInPage from './models/FailedLogInPage'

var axios = require('axios');

const emptyLogInInfo = {
    response: "",
    username: "",
    password: "",
    emailAddress: "",
    repeatPassword: ""
}

/**
 * @description Handles the LogIn process from the client side.
 */
export default class LogIn extends React.Component {
    
    /**
     * @description Initialize the LogIn component.
     * @param {Object} props (Not used)
     */
    constructor(props) {
        super(props);
        this.state = emptyLogInInfo;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleNewSignUpRequest = this.handleNewSignUpRequest.bind(this);
        this.handleSubmittedSignup = this.handleSubmittedSignup.bind(this);
        this.handleLogInRequest = this.handleLogInRequest.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
    }
    
    /**
     * @description Make a HTTP request to the provided URL
     * @param {string} method The HTTP method to use, e.g. "post"
     * @param {string} url The URL to which the request will be made
     * @param {Object} data The payload that will be sent to the URL
     * @param {function} callBack The function that handles the response
     */
    makeHttpRequest(method, url, data, callBack) {
        axios({
            method: method,
            url: url,
            data: data
        }).then((response) => {
            callBack(response);
        }).catch((error) => {
            console.log(error);
        });
    }
    
    /**
     * @description Update the state variables to reflect changes in input, 
     * e.g. typing in text boxes
     * @param {React.SyntheticEvent} event The event that has encountered a change
     */
    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    /**
     * @description Render the login page for returning users
     * @param {React.SyntheticEvent} event The event that had this function as 
     * an attribute.
     */
    handleLogInRequest(event) {
        ReactDOM.render(
            <LogInPage 
                handleLogIn={this.handleLogIn}
                username={this.state.username}
                password={this.state.password}
                handleInputChange={this.handleInputChange}
                handleNewSignUpRequest={this.handleNewSignUpRequest}
            />, document.getElementById("card")
        )
    }
    
    /**
     * @description Render the signup page for new users
     * @param {React.SyntheticEvent} event The event that had this function as 
     * an attribute.
     */
    handleNewSignUpRequest(event) {
        ReactDOM.render(
            <SignUpPage
                username={this.state.username}
                emailAddress={this.state.emailAddress}
                password={this.state.password}
                repeatPassword={this.state.repeatPassword}
                handleInputChange={this.handleInputChange}
                handleLogInRequest={this.handleLogInRequest}
                handleSubmittedSignup={this.handleSubmittedSignup}
            />, document.getElementById("card")
        );
    }
    
    /**
     * @description Send the login request to the server for authentication.
     * If the user is legitimate, load the app page, otherwise load the 
     * 'unsuccessful login' page. 
     * 
     * @param {React.SyntheticEvent} event The event that had this function as
     * an attribute.
     */
    handleLogIn(event) {
        this.makeHttpRequest(
            "post", "/login",
            {
                username: this.state.username,
                password: this.state.password
            },
            (response) => {
                if (response["data"]["success"] === true) {
                    ReactDOM.render(
                        <AppManager userIDInApp={response["data"]["message"]} />, 
                        document.getElementById("card"));
                } else {
                    var message = "<p>" + response["data"]["message"] + "</p>";
                    ReactDOM.render(
                        <FailedLogInPage
                            handleLogInRequest={this.handleLogInRequest}
                            handleNewSignUpRequest={this.handleNewSignUpRequest}
                            failureMessage={message} 
                        />, document.getElementById("card")
                    );
                }
            }
        )
    }
    
    /**
     * @description Render the app page for a newly registered user.
     * 
     * @param {React.SyntheticEvent} event The event that had this function as
     * an attribute.
     */
    handleSubmittedSignup(event) {
        this.makeHttpRequest(
            "post", "/register-user",
            {
                username: this.state.username,
                password: this.state.password,
                email: this.state.emailAddress
            }, (response) => {
                if (response["data"]["success"]) {
                    ReactDOM.render(
                        <AppManager userIDInApp={response["data"]["message"]}/>, 
                        document.getElementById("card")
                    );
                } else {
                    ReactDOM.render(
                        <FailedLogInPage
                            handleLogInRequest={this.handleLogInRequest}
                            handleNewSignUpRequest={this.handleNewSignUpRequest}
                            failureMessage={response["data"]["message"]}
                        />, document.getElementById("card")
                    );
                }
            }
        )
    }
    
    /** 
     * @description Render the login page for returning users.
     * @returns {JSX.Element} The LogIn page. 
     */
    render() {
        return (
            <LogInPage 
                username={this.state.username}
                password={this.state.password}
                handleInputChange={this.handleInputChange}
                handleNewSignUpRequest={this.handleNewSignUpRequest}
                handleLogIn={this.handleLogIn}
            />
        )
    }
}
