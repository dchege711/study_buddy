import React from 'react';

function LogInPage(props) {
    return (
        
        <div className="w3-center w3-padding-16">
            <form onSubmit={props.handleSubmit}>
            
                <label className="w3-center">Username<br /><br />
                    <input className="w3-padding-small" type="text" name="username" value={props.username} 
                    placeholder="e.g. xyz" onChange={props.handleInputChange} />
                </label>
                
                <br />
                <br />
                
                <label className="w3-center">Password<br /><br /> 
                    <input className="w3-padding-small" type="password" name="password" value={props.password} 
                    placeholder="password" onChange={props.handleInputChange} />
                </label>
                
                <br />
                <br />
                
                <input className="w3-center w3-button:hover w3-padding-small" type="submit" value="Login" />
                
                <br />
                <br />
                <br />
        
                <input className="w3-center w3-button:hover w3-padding-small" name="orSignUp" type="submit" value="Or Sign Up..." />
                
            </form>
        </div>
    )
}

export default LogInPage;
