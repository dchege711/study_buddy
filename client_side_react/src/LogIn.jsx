import React from 'react';
import ReactDOM from 'react-dom';
import AppManager from './AppManager'
import SignUpPage from './models/SignUpPage'
import LogInPage from './models/LogInPage'

const emptyLogInInfo = {
    response: "",
    username: "",
    password: "",
    emailAddress: "",
    repeatPassword: ""
}

export default class LogIn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = emptyLogInInfo;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleNewSignUpRequest = this.handleNewSignUpRequest.bind(this);
        this.handleSubmittedSignup = this.handleSubmittedSignup.bind(this);
        this.handleLogInRequest = this.handleLogInRequest.bind(this);
    }
    
    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
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
    
    handleLogIn(event) {
        console.log("handleLogIn() was called");
        ReactDOM.render(<AppManager />, document.getElementById("card"));
    }
    
    handleSubmittedSignup(event) {
        ReactDOM.render(<AppManager />, document.getElementById("card"));
    }
    
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
