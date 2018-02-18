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
        // Binding is necessary to make this work in the callback
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();
        event.persist();
        
        var eventValue = event.target.value;
        console.log(event.target);
        if (eventValue === "LogIn") {
            ReactDOM.render(<AppManager />, document.getElementById("card"));
        } else if (eventValue === "Sign me up!") {
            return;
        } else if (eventValue === "Or Sign Up...") {
            ReactDOM.render(
                <SignUpPage 
                    handleSubmit={this.handleSubmit}
                    username={this.state.username}
                    emailAddress={this.state.emailAddress}
                    password={this.state.password}
                    repeatPassword={this.state.repeatPassword}
                    handleInputChange={this.handleInputChange}
                />, document.getElementById("card")
            );
        } else if (eventValue === "Back to LogIn Page") {
            ReactDOM.render(
                <LogInPage 
                    handleSubmit={this.handleSubmit}
                    username={this.state.username}
                    password={this.state.password}
                    handleInputChange={this.handleInputChange}
                />, document.getElementById("card")
            );
        }
    }
    
    render() {
        return (
            // <LogInPage 
            //     handleSubmit={this.handleSubmit}
            //     username={this.state.username}
            //     password={this.state.password}
            //     handleInputChange={this.handleInputChange}
            // />
            <AppManager />
        )
    }
}
