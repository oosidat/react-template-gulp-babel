'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
    gulp.start([
        'build:scripts',
        'build:markup',
        'build:styles'
    ]);
});

gulp.task('build:scripts', function () {
    browserify({
        entries: 'app/index.jsx',
        extensions: ['.jsx'],
        debug: true
    })
    .transform(babelify.configure({presets: ['es2015', 'react']}))
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('build:markup', function() {
    gulp.src('./app/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:styles', function() {
    gulp.src('./app/styles/**/*')
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = connect()
    .use(require('connect-livereload')({ port: 35729 }))
    .use(serveStatic('dist'))
    .use(serveIndex('dist'));

    require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
        console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('watch', function() {
    gulp.start([
        'watch:scripts',
        'watch:styles',
        'watch:markup',
    ]);
});

gulp.task('watch:scripts', function() {
    gulp.start('build:scripts');
    gulp.watch(['./app/**/*.jsx', './app/**/*.js'], function() {
        gulp.start('build:scripts');
    });
});

gulp.task('watch:styles', function() {
    gulp.start('build:styles');
    gulp.watch('./app/**/*.css', function() {
        gulp.start('build:styles');
    });
});

gulp.task('watch:markup', function() {
    gulp.start('build:markup');
    gulp.watch('./app/**/*.html', function() {
        gulp.start('build:markup');
    });
});

gulp.task('serve', ['connect'], function () {
    var livereload = require('gulp-livereload');

    livereload.listen();

    require('opn')('http://localhost:9000');

    // watch for changes
    gulp.watch([
        'dist/*.html',
        'dist/styles/**/*.css',
        'dist/scripts/**/*.js',
        'dist/images/**/*'
    ]).on('change', livereload.changed);
});

gulp.task('default', ['build']);
