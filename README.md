# react-xhr-uploader

React component for uploading files with XMLHTTPRequest v2

## Example express server

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
