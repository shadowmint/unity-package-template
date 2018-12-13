let path = require('path');
let fs = require('fs');
let copy = require('./copy');
let folders = require('./folders');

// Exit vars
let done = false;

// Paths
let root = folders.getInitCwd();
let src = path.join(__dirname, '..', 'src');
let pkg = path.join(root, 'Assets', 'pkg-all');
let isModule = fs.existsSync(path.join(root, 'package.json'));

// Create folder if missing
if (isModule) {
  copy.copy(src, pkg).then(() => {
    done = true;
  }, (err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  console.log('Skip install, not a project: ' + root);
  done = true;
}

(function wait() {
  if (!done) setTimeout(wait, 100);
})();
