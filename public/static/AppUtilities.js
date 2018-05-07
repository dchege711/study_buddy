/**
 * @description Prepare a JSON document from the form's inputs.
 * 
 * @param {string} form_id The ID of the form
 * @param {string} url The url at which the form will be processed
 * @param {Function} callBack Function to call once done. Should take in a JSON
 * argument. 
 */
function sendForm(form_id, url, callBack) {
    var form = document.getElementById(form_id);
    var elements = document.getElementById(form_id).elements;

    // if (form.reportValidity() === false) {
    //     alert("Please fill out the required fields");
    //     return;
    // }

    // Send the form to the server for further processing.
    var payload = {};
    for (var i = 0; i < elements.length; i++) {
        payload[elements[i].name] = elements[i].value;
    }
    delete payload[""];

    sendHTTPRequest("POST", url, payload, callBack);
}

/**
 * @description Send a HTTP request with the specified arguments.
 * 
 * @param {string} method The method to use, e.g. `POST`
 * @param {string} url The URL that the request will be sent to
 * @param {JSON} payload The data that will be sent along with the request
 * @param {Function} callBack The function to call once req is successful
 */
function sendHTTPRequest(method, url, payload, callBack) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callBack(JSON.parse(this.responseText));
        }
    }
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(payload));
}

