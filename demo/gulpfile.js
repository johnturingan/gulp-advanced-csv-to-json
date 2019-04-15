/**
 * Created by isda on 22/04/2016.
 * Modified by billbliss on 10 April 2019
 */

var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var aCsvToJson = require('../index.js');

var options = {
    configs: {
      src: "templates/**/*.conf"
    }
}

gulp.task('convert', function () {

    var c = false;

    if (g.util.env.optimize)
        c = true;

    return gulp.src(options.configs.src)
        .pipe(aCsvToJson({
            tabSize : 4
        }))
        .on('error', g.util.log);
});

// Same as convert task except treats empty strings in CSV as nulls
gulp.task('convert2', function () {

    var c = false;

    if (g.util.env.optimize)
        c = true;

    return gulp.src(options.configs.src)
        .pipe(aCsvToJson({
            tabSize : 4,
            emptyStringAsNull : true
        }))
        .on('error', g.util.log);
});