/**
 * @description Prepare a JSON document from the form's inputs.
 * 
 * @param {string} form_id The ID of the form
 * @param {string} url The url at which the form will be processed
 * 
 * @return {Promise} Should take in a JSON argument. 
 */
exports.sendForm = function(form_id, url) {
    return new Promise(function(resolve, reject) {
        let form = document.forms[form_id];

        if (form.checkValidity()) {
            // Send the form to the server for further processing.
            let elements = form.elements;
            let payload = {};
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].type == "checkbox") {
                    payload[elements[i].name] = elements[i].checked;
                } else {
                    payload[elements[i].name] = elements[i].value;
                }
            }
            delete payload[""];

            exports.sendHTTPRequest("POST", url, payload)
                .then((response) => { resolve(response); })
                .catch((err) => { reject(err); })
        } else {
            form.reportValidity();
            reject("Please fill in the form with valid inputs.");
        }
    });
}

/**
 * @description Send a HTTP request with the specified arguments.
 * 
 * @param {string} method The method to use, e.g. `POST`
 * @param {string} url The URL that the request will be sent to
 * @param {JSON} payload The data that will be sent along with the request
 * @return {Promise} 
 */
exports.sendHTTPRequest = function(method, url, payload) {
    return new Promise(function(resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    let json_response_data = JSON.parse(this.responseText);
                    resolve(json_response_data);
                } catch (err) { 
                    reject(err); 
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(payload));
    });
}

/**
 * @description Parse the parameters that are passed in the URL and perform
 * the expected actions.
 */
exports.processParams = function() {
    var params = (new URL(document.location)).searchParams;
    if (params.has("msg")) alert(params.get("msg"));
}


/**
 * @description Fetch information about the user from Local Storage
 */
exports.getAccountInfo = function() {
    let retrievedAccountInfo = localStorage.getItem("session_info");
    if (retrievedAccountInfo === null) return retrievedAccountInfo;
    else return JSON.parse(retrievedAccountInfo);
}

/**
 * @description Set new information about the user in Local Storage
 */
exports.updateAccountInfo = function(newInfo) {
    let existingInfo = exports.getAccountInfo();
    if (existingInfo === null) existingInfo = {};
    Object.keys(newInfo).forEach((key) => {
        existingInfo[key] = newInfo[key];
    });
    localStorage.setItem("session_info", JSON.stringify(existingInfo));
}
