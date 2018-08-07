/**
 * @description A function to interpret JSON documents into server responses.
 * @param {JSON} result_JSON Expected keys: `status`, `success`, `message`
 * @param {Response} res An Express JS res object 
 */
exports.convertObjectToResponse = function (result_JSON, res) {
    if (result_JSON.status < 400) {
        res.json(result_JSON);
    } else if (result_JSON.status >= 400 && result_JSON.status < 500) {
        res.render("pages/4xx_error_page.ejs", { response_JSON: result_JSON });
    } else {
        res.render("pages/5xx_error_page.ejs", { response_JSON: result_JSON });
    }
};