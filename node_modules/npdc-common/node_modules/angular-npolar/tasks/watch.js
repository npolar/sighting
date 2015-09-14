var task = function(gulp, config) {
  'use strict';

  var watch = require('gulp-watch');
  var runSequence = require('run-sequence').use(gulp);

  gulp.task('watch', function() {
    watch(config.src.jsAll, function () { runSequence(['lint', 'test']);});
  });
};

module.exports = task;
