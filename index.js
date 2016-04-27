/**
 * Created by John Turingan on 22/04/2016.
 */

'use strict';
var path = require('path');
var fs = require('graceful-fs');
var gutil = require('gulp-util');
var es = require('event-stream');
var csv = require('csv');
var $q = require('q');
var _ = require('lodash');
var dotize = require('dotize');
var jsonfile = require('jsonfile');

var C2JProcessor = {

    init : function (fileContents, options) {

        var self = this;
        var c = JSON.parse(fileContents);

        if (!_.isArray(c)) {
            throw new gutil.PluginError('gulp-csv-to-json', 'Invalid configuration. Must be array of object');
        }

        var promises = [];

        _.each(c, function (i) {

            if (_.isEmpty(i.contract)) {

                promises.push(self.flatJson(i));

            } else {

                promises.push(self.parseCsv(i, i.contract));

            }
        });

        $q.all(promises)

            .then(function (i) {
                _.each(i, function (c) {

                    self.saveToFile(c, _.extend(c.file,options));

                });
            });
    },

    saveToFile : function (c, options) {

        var outName = options.filePath.replace(/^.*[\\\/]/, '').replace('.csv', '');

        var file = options.outputPath || 'output/' + outName + '.json';

        var dirname = file.match(/(.*)[\/\\]/)[1]||'';

        if (!fs.existsSync(dirname)){
            fs.mkdirSync(dirname);
        }

        jsonfile.writeFile(file, c.data, { spaces: options.tabSize }, function (err) {

            if (!_.isNull(err)) {

                console.error("ERROR: Error during save. " + err);
            }
        })
    },

    flatJson : function (item) {

        var defer = $q.defer();

        var p = this._parse(item.filePath);

        p.then (function (d) {
            defer.resolve({
                file : item,
                data : d
            })
        });

        return defer.promise;

    },

    parseCsv : function (item, contract) {

        var defer = $q.defer();

        var temp = [];

        var _flatten  = function(csv, obj) {

            var dots = dotize.convert(obj);

            var c = _.cloneDeep(obj);

            _.each(dots, function (value, key) {

                var t = value.split(':');

                switch (t[0]) {
                    case "Array" :

                        _.set(c, key, csv[t[1]].split('|'));

                        break;

                    case "Double" :
                        var n = parseFloat(csv[t[1]]);

                        _.set(c, key, isNaN(n) ? 0 : n);

                        break;

                    case "String" :
                    default :

                        _.set(c, key, csv[value]);

                        break;
                }


            });

            temp.push(c);
        };

        var p = this._parse(item.filePath);

        p.then(function (d) {

            _.each(d, function (csv) {
                _flatten(csv, contract);
            });

            defer.resolve({
                file : item,
                data : temp
            })
        });

        return defer.promise;
    },

    _parse : function (file) {

        var defer = $q.defer();

        if (fs.existsSync(file)) {
            var bufferContents = fs.readFileSync(file);

            var x = csv.parse(bufferContents.toString(), {

                columns : true,
                trim : true

            }, function (e, o) {

                defer.resolve(o);
            });

        } else {
            throw new gutil.PluginError('gulp-csv-to-json', 'File not found: ' + file);
        }

        return defer.promise;
    }
};



module.exports = function(options) {

    var opt = {
        tabSize : 2
    };

    opt = _.extend(opt, options);

    function csvToJson(file, cb) {

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            throw new gutil.PluginError('gulp-csv-to-json', 'stream not supported');
        }

        if (file.isBuffer()) {
            C2JProcessor.init(String(file.contents), opt)
        }

        cb(null, file);
    }

    return es.map(csvToJson)
};