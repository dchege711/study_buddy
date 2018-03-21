/**
 * @description A controlled component that renders the 
 * unsuccessful login page.
 * 
 * @author Chege Gitau
 */

import React from 'react';

/**
 * Set text as HTML
 * 
 * @param {String} text The message that should be displayed as HTML 
 */
function setHTML(text) {
    return {
        __html: text
    }
}

/**
 * @param {function} props handleLogInRequest(), handleNewSignUpRequest()
 * @returns {JSX.Element} The 'unsuccessful login page.
 */
function FailedLogInPage(props) {
    return (
        <div className="w3-container w3-center w3-padding-16">
            <div
                dangerouslySetInnerHTML={setHTML(props.failureMessage)}
            />
            
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
