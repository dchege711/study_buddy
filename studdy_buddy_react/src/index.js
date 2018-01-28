import React from 'react';
import ReactDOM from 'react-dom';
import './css/w3.css';
// const logInTemplate = require('./templates/logInTemplate')

class LogIn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
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
        // To-Do: Validate that the user is legit
        event.preventDefault();
    }
    
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
            
                <label>Username
                    <input type="text" name="username" value={this.state.username} 
                    placeholder="Enter Username" onChange={this.handleInputChange} />
                </label>
                
                <label>Password
                    <input type="password" name="password" value={this.state.password} 
                    placeholder="Enter Password" onChange={this.handleInputChange} />
                </label>
                
                <input type="submit" value="Submit" />
                
            </form>
        )
    }
}

// ========================================

ReactDOM.render(
    <LogIn />,
    document.getElementById('root')
);
