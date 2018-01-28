import React from 'react';

export default function() {
    
    return (
        <form id="search-form">
        
            <div class="w3-container">
                <div class="w3-image" >
                    <img src={require("./templates/avatar_login.png")} alt="Avatar" height="50px" width="50px"/>
                </div>
                
                <div class="w3-container">
                    <label><b>Username</b></label>
                    <input class="w3-padding-small" type="text" name="username" placeholder="Enter Username" required />
                    
                    <label><b>Password</b></label>
                    <input class="w3-padding-small" type="password" name="psw" placeholder="Enter Password" required />
                    
                    <button class="w3-button:hover w3-padding-small" type="submit" onclick="return processLogin()">Login</button>
                </div>
            </div>
        
        </form>
        
    )
}
