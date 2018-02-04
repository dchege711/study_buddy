import React from 'react';
import ReactDOM from 'react-dom';
import SuccessLogin from './SuccessLogin'

const myUserName = process.env.STUDY_BUDDY_USERNAME
const myPassword = process.env.STUDY_BUDDY_PASSWORD

export default class LogIn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            response: "",
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
        event.preventDefault();
        
        // To-Do: Validate that the user is legit
        if (this.state.username === myUserName && this.state.password === myPassword) {
            ReactDOM.render(<SuccessLogin />, document.getElementById("card"));
        } else {
            ReactDOM.render(<SuccessLogin />, document.getElementById("card"));
        }
        
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
                
                <input type="submit" value="Login" />
                
            </form>
        )
    }
}
