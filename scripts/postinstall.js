var mkdirp = require('mkdirp');
var path = require('path');
var ncp = require('ncp');

// Paths
var src = path.join(__dirname, '..', 'src');
var dir = path.join(__dirname, '..', '..', '..', 'Assets', 'packages');
var ismodule = __dirname.split(path.sep).filter(function(i) { return i == 'node_modules'; }).length > 0;

// Create folder if missing
if (ismodule) {
  mkdirp(dir, function (err) {
    if (err) {
      console.error(err)
      process.exit(1);
    }

    // Copy files
    ncp(src, dir, function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });
}
