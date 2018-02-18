import React from 'react';

function SignUpPage(props) {
    return (
        <div className="w3-center w3-padding-16">
            <form onSubmit={props.handleSubmit}>
            
                <label className="w3-center">Email Address<br /><br />
                    <input className="w3-padding-small" type="text" name="emailAddress" value={props.emailAddress} 
                    placeholder="e.g. xyz@gmail.com" onChange={props.handleInputChange} />
                </label>
                
                <br />
                <br />
                
                <label className="w3-center">Username<br /><br />
                    <input className="w3-padding-small" type="text" name="username" value={props.username} 
                    placeholder="e.g. xyz" onChange={props.handleInputChange} />
                </label>
                
                <br />
                <br />
                
                <label className="w3-center"> Create a Password<br /><br /> 
                    <input className="w3-padding-small" type="password" name="password" value={props.password} 
                    placeholder="password" onChange={props.handleInputChange} />
                </label>
                
                <br />
                <br />
                
                <label className="w3-center"> Repeat Password<br /><br /> 
                    <input className="w3-padding-small" type="password" name="repeatPassword" value={props.repeatPassword} 
                    placeholder="password" onChange={props.handleInputChange} />
                </label>
                
                <br />
                <br />
                
                <input className="w3-center w3-button:hover w3-padding-small" type="submit" value="Sign me up!" />
                
                <br />
                <br />
                <br />
                
                <input className="w3-center w3-button:hover w3-padding-small" type="submit" value="Back to LogIn Page" />
                
            </form>
        </div>
    )
}

export default SignUpPage;
