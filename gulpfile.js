/* GULP LIBS */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var csslint = require('gulp-csslint');
var minifyCSS = require('gulp-minify-css');
var lr = require('tiny-lr');
var livereload = require('gulp-livereload');
var server = lr();
var es = require('event-stream');
var header = require('gulp-header');

// loading config.json
var config = require('./config.json');

if (!config.hasOwnProperty('dir')) {
    config.dir = {
        'dest': 'build',
        'src': 'src'
    };
}

/* DIRECTORIES */
var dirSrc = 		config.dir.src;
var dirDest = 		config.dir.dest;

var dirAllJs = 		 dirSrc + "/js/**/*.js";
var dirAllImg = 	 dirSrc + "/img/**/*";
var dirAllCss = 	 dirSrc + "/css/**/*.css";
var dirAllLess = 	 dirSrc + "/less/**/*.less";
var dirSrcCss = 	 dirSrc + "/css";
var dirAllAssets =   dirSrc + "/assets/**/*";
var dirAllFonts =    dirSrc + "/fonts/**/*";
var dirAllPartials = dirSrc + "/partials/**/*";

var dirClean = 		dirDest + "/*";
var dirDestImg = 	dirDest + "/img";
var dirDestJs = 	dirDest + "/js";
var dirDestCss = 	dirDest + "/css";

/* TASKS */

gulp.task('default', ['scripts', 'jshint', 'copy-node-modules', 'copy-unprocessed', 'images', 'less-css-minify', 'fonts', 'assets', 'partials'], function(cb){
    cb();
});

/**
 * clears the build directory by removing all files in it.
 */
gulp.task('clean', function(cb){
     gulp.src(dirClean)
        .pipe(clean());

    cb();
});

/**
 * checks every js file for errors
 */
gulp.task('jshint', function(cb) {
    gulp.src([dirAllJs, "./gulpfile.js"])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

    cb();
});

gulp.task('csslint', ['less'], function(cb){
    gulp.src([dirSrcCss])
        .pipe(csslint())
        .pipe(csslint.reporter());

    cb();
});

/**
 * uglifies and copies every js file to the destination. it does not merge the js files to one single file yet.
 */
gulp.task('scripts', ['jshint'], function(){
    var result = gulp.src(dirAllJs);

    if (config.uglify_js) {
        result = result.pipe(uglify());
    }

    return result.pipe(header(config.header.message))
        .pipe(gulp.dest(dirDestJs))
        .pipe(livereload(server));
});

/**
 * optimizes and copies every image within the image folder to the destination
 */
gulp.task('images', function() {
    return gulp.src(dirAllImg)
        .pipe(imagemin({ optimizationLevel: config.task.imagemin.optimizationLevel }))
        .pipe(gulp.dest(dirDestImg))
        .pipe(livereload(server));
});

/**
 * compiles every less file to css. minifies the result and moves it to the destination
 */
gulp.task('less-css-minify', function(){
    var result = gulp.src(dirAllLess).pipe(less());

    if (config.uglify_css) {
        result = result.pipe(minifyCSS());
    }

    return result.pipe(header(config.header.message))
        .pipe(gulp.dest(dirDestCss))
        .pipe(livereload(server));
});

/**
 * just copies the font directory to the destination
 */
gulp.task('fonts', function(){
    return gulp.src(dirSrc + "/fonts/**/*")
        .pipe(gulp.dest(dirDest + "/fonts"))
        .pipe(livereload(server));
});

/**
 * just copies the assets directory to the destination
 */
gulp.task('assets', function(){
    return gulp.src(dirSrc + "/assets/**/*")
        .pipe(gulp.dest(dirDest + "/asssets"))
        .pipe(livereload(server));
});

/**
 * just copies the partials directory to the destination
 */
gulp.task('partials', function(){
    return gulp.src(dirSrc + "/partials/**/*")
        .pipe(gulp.dest(dirDest + "/partials"))
        .pipe(livereload(server));
});

/**
 * moves root files which are specified in the config.json to the destination
 */
gulp.task('copy-unprocessed', function(){  
    return gulp.src(config.copy).pipe(gulp.dest(dirDest)).pipe(livereload(server));
});

/**
 * moves and uglifies node module js files as specified in config.json
 */
gulp.task('copy-node-modules', ['scripts'], function(){
    var files = config.node_modules.copy;

    var result =  "";

    for (var i = 0; i < files.length; i++) {
        var from = files[i].from;
        var to = files[i].to;

        result += "gulp.src('"+from+"').pipe(uglify()).pipe(gulp.dest('"+to+"'))";

        if (i < files.length - 1) {
            result += ",";
        }
    }

    return es.concat(eval(result)).pipe(livereload(server));
});

/**
 * starts the watch task listening for changes in the specified folders.
 * every task should trigger a server reload.
 */
gulp.task('watch', function () {
    gulp.watch(dirAllLess, 		['less-css-minify']);
    gulp.watch(dirAllJs, 		['scripts']);
    gulp.watch(dirAllImg, 		['images']);
    gulp.watch(config.copy, 	['copy-unprocessed']);
    gulp.watch(dirAllPartials, 	['partials']);
    gulp.watch(dirAllAssets, 	['assets']);
    gulp.watch(dirAllFonts, 	['fonts']);
});

gulp.task('watch-with-default', ['default'], function () {
    gulp.watch(dirAllLess, 		['less-css-minify']);
    gulp.watch(dirAllJs, 		['scripts']);
    gulp.watch(dirAllImg, 		['images']);
    gulp.watch(config.copy, 	['copy-unprocessed']);
    gulp.watch(dirAllPartials, 	['partials']);
    gulp.watch(dirAllAssets, 	['assets']);
    gulp.watch(dirAllFonts, 	['fonts']);
});

/**
 * starts the server which watches files changes
 */
gulp.task('server', ['watch'], function(){
    console.log("server starting...");
    server.listen(35729, function (err) {
        if (err) return console.log(err);
    });
});

gulp.task('server-with-default', ['watch-with-default'], function(){
    console.log("server starting...");
    server.listen(35729, function (err) {
        if (err) return console.log(err);
    });
});

gulp.task('dev', ['server-with-default']);