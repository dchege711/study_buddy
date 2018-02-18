/*
 * FailedLogInPage.jsx
 *
 * If a user unsuccessfully tries to log in, show this page
 * This component is controlled by LogIn.jsx
 *
 * Props needed:
 *
 * handleLogInRequest, handleNewSignUpRequest
 *
 * Author: Chege Gitau
 *
 */

import React from 'react';

function FailedLogInPage(props) {
    return (
        <div className="w3-container w3-center w3-padding-16">
            <p>
                Oops! Unsucessful login attempt.
            </p>
            
            <br />
            <br />
            
            <input className="w3-center w3-button:hover w3-padding-small" 
                type="submit" value="Try Again" onClick={props.handleLogInRequest}/>
            
            <br />
            <br />
            <br />
    
            <input className="w3-center w3-button:hover w3-padding-small" 
                type="submit" value="No Account? Sign Up Here" onClick={props.handleNewSignUpRequest}/>
                
        </div>
    )
}

export default FailedLogInPage;
