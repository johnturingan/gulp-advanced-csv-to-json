/**
 * Created by isda on 22/04/2016.
 */

var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var csvToJson = require('../index.js');

var p = require('./package.json').options;

gulp.task('test', function () {

    var c = false;

    if (g.util.env.optimize)
        c = true;

    return gulp.src(p.configs.src)
        .pipe(csvToJson({
            tabSize : 4
        }))
        .on('error',g.util.log)
        ;
});