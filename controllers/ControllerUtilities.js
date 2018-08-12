/**
 * @description A function to interpret JSON documents into server responses.
 * @param {JSON} result_JSON Expected keys: `status`, `success`, `message`
 * @param {Response} res An Express JS res object 
 */
exports.convertObjectToResponse = function (result_JSON, res) {
    let status = result_JSON.status;
    if (status >= 200 && status < 300) {
        res.json(result_JSON);
    } else if (status >= 300 && status < 400) {
        res.redirect(status, result_JSON.redirect_url + "?msg=" + encodeURIComponent(result_JSON.message));
    } else if (status >= 400 && status < 500) {
        res.render("pages/4xx_error_page.ejs", { response_JSON: result_JSON });
    } else {
        res.render("pages/5xx_error_page.ejs", { response_JSON: result_JSON });
    }
};