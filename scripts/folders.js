let path = require('path');
let fs = require('fs');

/**
 * In node 5.4+ INIT_CWD is the initial path with npm has been executed for various install and script hooks.
 * Extract that value and fix it if its wrong for some reason (eg. git bash)
 */
function getInitCwd() {
  let root = process.env.INIT_CWD;
  if (!root) {
    throw new Error('Missing INIT_CWD env variable. Run using npm >= 5.4 or use INIT_CWD=`pwd` npm install to manually specify the root folder');
  }

  // Git bash uses /c/... style folder paths, but we need proper ones for the install script.
  const isFail = /^win/.test(process.platform);
  if (/^\/c\//.test(root) && isFail) {
    root = root.substr('/c'.length);
  }

  root = path.resolve(root);

  if (!fs.existsSync(root)) {
    throw new Error('Invalid INIT_CWD: No such path: ' + root);
  }

  return root;
}

module.exports = {
  getInitCwd: getInitCwd
};
