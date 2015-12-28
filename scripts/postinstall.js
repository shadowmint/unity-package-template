var mkdirp = require('mkdirp');
var path = require('path');
var ncp = require('ncp');

// Paths
var src = path.join(__dirname, '..', 'src');
var dir = path.join(__dirname, '..', '..', '..', 'Assets', 'packages');

// Create folder if missing
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
