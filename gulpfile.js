'use strict';

    var gulp        = require('gulp'),
        browserify  = require('browserify'),
        source      = require('vinyl-source-stream'),
        buffer      = require('vinyl-buffer'),
        uglify      = require('gulp-uglify'),
        jshint      = require('gulp-jshint'),
        concat      = require('gulp-concat'),
        browserSync = require('browser-sync'),
        notify      = require('gulp-notify'),
        csso        = require('gulp-csso'),
        minifyCSS   = require('gulp-minify-css'),
        concatCss   = require('gulp-concat-css');




gulp.task('browserify', function() {
    return browserify({ entries: ['./app.js'] })
      //  .on('error', notify.onError({message: '<%= error.message %>', title: 'Gulp browserify'}))
        .bundle()
        .pipe(source('./bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('.'));
});

/*Problems running lint with browser-sync*/
gulp.task('lint', function() {
  gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('minify-js', function () {
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('compile-css', function() {
	return gulp.src('./src/css/*.css')
	.pipe(concatCss('app.css'))
	.pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
	return gulp.src('./src/css/*.css')
	.pipe(concatCss('app.min.css'))
	.pipe(csso())
	.pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function () {
   var files = [
      '*.html',
      '*.js',
      './src/*.html',
      './src/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: '.'
      }
   });
});


gulp.task('default', ['browserify', 'minify-js','browser-sync'] );
