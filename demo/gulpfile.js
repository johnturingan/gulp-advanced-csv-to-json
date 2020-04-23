/**
 * Created by isda on 22/04/2016.
 * Modified by billbliss on 10 April 2019
 */

const gulp = require('gulp');
const log = require('fancy-log');
const aCsvToJson = require('../index.js');
// const argv = require('minimist')(process.argv.slice(2));

let options = {
    configs: {
      src: "templates/**/*.conf"
    }
};

gulp.task('convert', function () {

    return gulp.src(options.configs.src)
        .pipe(aCsvToJson({
            tabSize : 4
        }))
        .on('error', log);
});

// Same as convert task except treats empty strings in CSV as nulls
gulp.task('convert2', function () {

    return gulp.src(options.configs.src)
        .pipe(aCsvToJson({
            tabSize : 4,
            emptyStringAsNull : true
        }))
        .on('error', log);
});

// Lets you group each item by property value
gulp.task('convert3', function () {

    return gulp.src(options.configs.src)
        .pipe(aCsvToJson({
            tabSize : 4,
            emptyStringAsNull : true,
            groupBy: "gender"
        }))
        .on('error', log);
});