import gulp  from 'gulp';
import run from 'run-sequence';
import unity from 'gulp-unity';
import xml2js from 'xml2js';
import fs from 'fs';
import path from 'path';

/// Dev target pattern
var dev = 'EventsTests';

/// Results file
var target = path.join(__dirname, 'EditorTestResults.xml');

gulp.task('default', function(callback) {
  fs.unlink(target, () => {
    run('unity-all', function() {
      unity.debug_test_results(target);
      callback();
    });
  });
});

gulp.task('dev', function(callback) {
  fs.unlink(target, () => {
    run('unity-dev', function() {
      var target = path.join(__dirname, 'EditorTestResults.xml');
      unity.debug_test_results(target);
      callback();
    });
  });
});

// Run unity tests
gulp.task('unity-all', function() {
  return gulp.src('./package.json')
    .pipe(unity({
      args: ['-runEditorTests'],
      debug: (v) => {
        v.debug([
          { pattern: /.*/, color: 'yellow' }
        ])
      }
    }));
});

// Run unity tests
gulp.task('unity-dev', function() {
  return gulp.src('./package.json')
    .pipe(unity({
      args: ['-runEditorTests', '-editorTestsFilter', dev],
      debug: (v) => {
        v.debug([
          { pattern: /.*/, color: 'yellow' }
        ])
      }
    }));
});
