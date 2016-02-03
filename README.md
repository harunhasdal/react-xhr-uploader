# React XHR Uploader

React component for uploading files with XMLHTTPRequest v2

Check full documentation with examples at [https://rma-consulting.github.io/react-xhr-uploader](https://rma-consulting.github.io/react-xhr-uploader)

Pull requests are welcome.

## How to run/develop locally

Use `npm start` to run the webpack development server at localhost:8080. Hot module replacement is enabled.

Use `npm test` to run the tests. Use `npm test:tdd` to run the tests continuously in watch mode.

Use `npm run test:lint` to run ESLint checks.

## Example express server

You will need a server that would accept post requests for multipart file uploads. Below is a sample express server to test out the examples.

```
const express = require('express');
const Busboy = require('busboy');
const fs = require('fs');

const port = 3000;
const app = express();

app.all('/api/uploadfile', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
 });

app.post('/api/uploadfile', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename) {
		let saveTo = __dirname + '/uploads/' + fieldname + '-' + filename + Date.now();
		file.pipe(fs.createWriteStream(saveTo));
	});
	busboy.on('finish', function() {
		res.end('done');
	});
  res.on('close', function() {
    req.unpipe(busboy);
  });
	req.pipe(busboy);
});

app.listen(port, '0.0.0.0', function () {
  console.log(`Uploader server listening on port ${port}!`);
});

```
