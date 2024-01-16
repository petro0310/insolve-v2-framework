const fs = require('fs');
const http = require('http');
const watchify = require('watchify');
const browserify = require('browserify');

const config = require('./src/config');

const b = browserify({entries: ['./src/index.js'], cache: {}, packageCache: {}, plugin: [watchify]});




http.createServer((req, res) => {
  fs.readFile(__dirname + req.url, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end(JSON.stringify(err));
    }

    res.writeHead(200);
    res.end(data);
  });
}).listen(process.env.PORT || config.port);

const bundle = (ids = []) => {
  if(ids.length > 0) console.log(`[${new Date().toGMTString().split(' ')[4]}] ${ids.length} file${ids.length !== 1 ? 's' : ''} was updated`);

  b.bundle().on('error', e => console.error(e.message)).pipe(fs.createWriteStream('./static/bundle.js'));
}

b.on('update', bundle);
bundle();

console.log(`App listening on port ${process.env.PORT || config.port}`);