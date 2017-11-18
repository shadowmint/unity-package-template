const fs = require('fs');
const path = require('path');

/** Log debug messages to the console? */
const DEBUG = true;

function copy(src, dest) {
  return new Promise((resolve, reject) => {
    walkFind(src).then((list) => {
      mkdir(dest).then(() => {
        walkCopy(src, dest, list).then(resolve, reject);
      }, reject);
    }, reject);
  });
}

function walkFind(src) {
  trace('explore: ' + src);
  let data = {pending: [src], busy: 0, dirs: [], files: [], error: null};
  return new Promise((resolve, reject) => {
    let step = () => {
      if (data.error) {
        reject(data.error);
      }
      else if (data.busy || data.pending.length) {
        walkFindFSM(src, data, step);
      }
      else {
        resolve(data);
      }
    };
    walkFindFSM(src, data, step);
  });
}

function walkFindFSM(root, data, step) {
  let doStep = () => setTimeout(step, 1);
  let aborted = false;

  // Busy waiting
  if (!data.pending.length) {
    setTimeout(doStep, 1000);
    return;
  }

  let dir = data.pending.shift();
  let dirShort = dir.substr(root.length + 1);
  data.busy += 1;
  trace("- Folder: " + dirShort);
  fs.readdir(dir, (err, list) => {
    if (aborted) return;
    if (err) {
      data.error = err;
      aborted = true;
      doStep();
      return;
    }

    // No files, skip
    if (list.length === 0) {
      data.busy -= 1;
      doStep();
      return;
    }

    // Check each file and process it
    let resolved = 0;
    for (let i = 0; i < list.length; i++) {
      let here = path.join(dir, list[i]);
      let hereShort = here.substr(root.length + 1);
      trace("-- File: " + hereShort);
      fs.stat(here, (err, stat) => {
        if (aborted) return;
        if (err) {
          aborted = true;
          data.error = err;
          doStep();
          return;
        }
        if (stat.isDirectory()) {
          data.pending.push(here);
        }
        else {
          data.files.push(hereShort);
        }
        resolved += 1;
        if (resolved === list.length) {
          data.busy -= 1;
          let shortname = dir.substr(root.length + 1, dir.length);
          data.dirs.push(shortname);
          trace("- Finished: " + hereShort);
          doStep();
        }
      });
    }
  });
}

function walkCopy(root, dest, data) {
  return new Promise((resolve, reject) => {
    let folderCount = 0;
    let fileCount = 0;
    let folders = data.dirs.map(i => path.join(dest, i));
    let files = data.files.map(i => [path.join(root, i), path.join(dest, i)]);
    let error = null;
    trace("Copy to: " + dest);
    let continueWithCopy = (path) => {
      folderCount += 1;
      trace("mkdir: (" + folderCount + "/" + folders.length + ") " + path);
      if (error) {
        reject(error);
      }
      if (folderCount === folders.length) {
        files.map(i => copyFile(i).then(() => finishedCopy(i), (err) => {
          error = err;
        }));
      }
    };
    let finishedCopy = (path) => {
      fileCount += 1;
      trace(" copy: (" + fileCount + "/" + files.length + ") " + path[1]);
      if (error) {
        reject(error);
      }
      if (fileCount === files.length) {
        resolve({folders: folders, files: files.map(i => i[1])});
      }
    };
    folders.map(i => mkdir(i).then(() => continueWithCopy(i), (err) => {
      error = err;
    }));
  });
}

function copyFile(paths) {
  const src = paths[0];
  const dest = paths[1];
  return new Promise((resolve, reject) => {
    try {
      let copyResult = (err) => {
        if (err) reject(err);
        resolve();
      };
      if (fs.copyFile) {
        fs.copyFile(src, dest, copyResult);
      }
      else {
        copyFileFallback(src, dest, copyResult);
      }
    }
    catch (err) {
      reject(err);
    }
  });
}

function copyFileFallback(source, target, cb) {
  let cbCalled = false;
  let rd = fs.createReadStream(source);
  rd.on("error", function (err) {
    done(err);
  });
  let wr = fs.createWriteStream(target);
  wr.on("error", function (err) {
    done(err);
  });
  wr.on("close", function (ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

function mkdir(target) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let parts = target.split(path.sep);
        parts[0] = '/';  // Split and recombine on absolute paths doesn't work.
        let partial = '';
        for (let i = 0; i < parts.length; i++) {
          partial = path.resolve(path.join(partial, parts[i]));
          if (!fs.existsSync(partial)) {
            fs.mkdirSync(partial);
          }
        }
        resolve();
      }
      catch (err) {
        reject(err);
      }
    }, 1);
  });
}

function trace(message) {
  if (DEBUG) {
    console.log(message);
  }
}

module.exports = {
  copy: copy
};
