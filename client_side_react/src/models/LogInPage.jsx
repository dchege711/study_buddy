/**
 * @description This component is controlled by LogIn.jsx
 * @author Chege Gitau
 */

import React from 'react';

/**
 * @param {object} props userName, handleInputChange(), password, handleLogIn
 * handleNewSignupRequest
 * @returns {JSX.Element} The Login page for returning users
 */
function LogInPage(props) {

    // Hide the sidebar panel
    document.getElementById("sidebar").hidden = true;

    return (
        <div className="w3-container w3-center w3-padding-16">
            <label className="w3-center">Username<br /><br />
                <input className="w3-padding-small" type="text" name="username" 
                    value={props.username} placeholder="e.g. xyz" 
                    onChange={props.handleInputChange} />
            </label>
            
            <br />
            <br />
            
            <label className="w3-center">Password<br /><br /> 
                <input className="w3-padding-small" type="password" 
                    name="password" value={props.password} placeholder="password" 
                    onChange={props.handleInputChange} />
            </label>
            
            <br />
            <br />
            
            <input className="w3-center w3-button:hover w3-padding-small" 
                type="submit" value="Login" onClick={props.handleLogIn}/>
            
            <br />
            <br />
            <br />
    
            <input className="w3-center w3-button:hover w3-padding-small" 
                type="submit" value="Or Sign Up..." onClick={props.handleNewSignUpRequest}/>
                
        </div>
    )
}

export default LogInPage;