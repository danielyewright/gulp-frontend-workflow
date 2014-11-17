var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var plumber = require('gulp-plumber');
var autorpefixer = require('gulp-autoprefixer');
var fileinclude = require('gulp-file-include');
var prettify = require('gulp-html-prettify');

var paths = {
  js: {
    source: 'src/js/**/*.js',
    watch: 'src/js/**/*.js',
    dest: 'src/js'
  },
  less: {
    source: 'src/less/**/*.less',
    watch: 'src/less/**/*.less',
    dest: 'src/css'
  },
  templates: {
    source: ['src/templates/blog.html', 'src/templates/index.html'],
    watch: 'src/templates/**/*.html',
    basePath: 'src/templates',
    dest: 'src'
  },
  startPage: 'src/index.html'
};

var settings = {
  uglify: {
    css: true,
    js: true
  }
};

gulp.task('default', ['scripts', 'less', 'fileinclude', 'webserver', 'watch']);

gulp.task('webserver', function () {
    gulp.src('.')
      .pipe(webserver({
        host: 'localhost',
        port: 8000,
        livereload: true,
        directoryListing: true,
        open: paths.startPage
      }));
  }
);

gulp.task('jshint', function () {
  gulp.src(paths.js.source)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('less', function (cb) {
  var result = gulp.src(paths.less.source)
    .pipe(plumber())
    .pipe(less())
    .pipe(autorpefixer());

  if (settings.uglify.css) {
    result = result.pipe(minifyCSS());
  }

  result.pipe(gulp.dest(paths.less.dest));
  cb();
});

gulp.task('scripts', ['jshint'], function(){
  var result = gulp.src(paths.js.source)
    .pipe(plumber());

  if (settings.uglify.js) {
    result.pipe(uglify());
  }

  result.pipe(gulp.dest(paths.js.dest));
});

gulp.task('fileinclude', function (cb) {
  gulp.src(paths.templates.source)
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: paths.templates.basePath
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(paths.templates.dest));
  cb();
});

gulp.task('watch', function () {
  gulp.watch(paths.less.watch, ['less']);
  gulp.watch(paths.js.watch, ['scripts']);
  gulp.watch(paths.templates.watch, ['fileinclude']);
});