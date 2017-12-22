// Strict mode converts 'bad syntax' into real errors.
// Such cases include mistyped variable names and assignment to non-writables
'use strict';

// Initialize the app
const express = require('express');
const app = express();

/*
 * Set what appears on the base url
 */

// Tip: => is a different way of writing an anonymous function.
app.get('/', (req, res) => {
  res.status(200).send('Working on study buddy!');
});

/*
 * Spin up the server
 */

// Tip: This is the equivalent of python's 'if __name__ == "__main__"'
if (module === require.main) {
  const server = app.listen(process.env.PORT || 8000, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

// Tip: Whatever you assign to module.exports will be exposed as a module
module.exports = app;
