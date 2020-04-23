/**
 * Created by John Turingan on 22/04/2016.
 */

'use strict';
const fs = require('graceful-fs');
const es = require('event-stream');
const csv = require('csv');
const $q = require('q');
const _ = require('lodash');
const jsonFile = require('jsonfile');
const PluginError = require('plugin-error');
const dot = require('dot-object');

let C2JProcessor = {

    initExtensions : function () {

        String.prototype.splitPlus = function(sep) {
            let a = this.split(sep);
            if (a[0] === '') return [];
            return a;
        };
    },

    init : function (fileContents, options) {

        let self = this;

        this.initExtensions();

        let c = JSON.parse(fileContents);

        if (!_.isArray(c)) {

            const gc = c['globalContract'];

            if (!_.isObject(gc)) {
                throw new PluginError('gulp-csv-to-json', 'Invalid configuration. Must declare global contract');
            }
            let a = [];

            _.each(c.list, function (cl) {

                const _c = cl['contract'];

                if (_c === 'global' || _c === true) {

                    cl.contract = gc;

                } else if (_.isObject(_c)) {

                    cl.contract = _c;

                }

                a.push(cl);
            });

            self.processPromises(a, options);

        } else {

            self.processPromises(c, options);
        }


    },

    processPromises : function (contract, options) {

        let self = this;

        let promises = [];

        _.each(contract, function (i) {

            if (_.isEmpty(i.contract)) {

                promises.push(self.flatJson(i, options));

            } else {

                promises.push(self.parseCsv(i, i.contract, options));

            }
        });

        $q.all(promises)

        .then(function (i) {
            _.each(i, function (p) {

                self.saveToFile(p, _.extend(p.file, options));

            });
        });
    },

    saveToFile : function (c, options) {

        let outName = options.filePath.replace(/^.*[\\\/]/, '').replace('.csv', '');

        let file = options.outputPath || 'output/' + outName + '.json';

        let dirname = file.match(/(.*)[\/\\]/)[1]||'';

        if (!fs.existsSync(dirname)){
            fs.mkdirSync(dirname);
        }

        jsonFile.writeFile(file, c.data, { spaces: options.tabSize }, function (err) {

            if (!_.isNull(err)) {

                throw new PluginError('gulp-csv-to-json', 'ERROR: Error during save. ' + err);

            }
        })
    },

    flatJson : function (item, options) {

        let defer = $q.defer();

        let p = this._parse(item.filePath);

        p.then ((d) => {

            d = this._groupBy(d, item, options);

            defer.resolve({
                file : item,
                data : d
            })
        });

        return defer.promise;

    },

    parseCsv : function (item, contract, options) {

        let defer = $q.defer();

        let temp = [];

        let _flatten  = function(csv, obj) {

            let dots = dot.dot(obj);

            let c = _.cloneDeep(obj);

            try {

                _.each(dots, function (value, key) {

                    let t = value.split(':');

                    switch (t[0]) {
                        case "Array" :

                            let m = t[1].match(/{([^}]+)}/);

                            if (_.isArray(m)) {
                                let k = null;
                                if (m[1] === 'int') {

                                    k = t[1].replace('{int}', '');

                                    let num = csv[k].splitPlus('|').map(function(item) {
                                        return parseInt(item, 10);
                                    });

                                    _.set(c, key, num);

                                } else if (m[1] === 'float') {
                                    k = t[1].replace('{float}', '');

                                    let f = csv[k].splitPlus('|').map(function(item) {
                                        return parseFloat(item);
                                    });

                                    _.set(c, key, f);

                                }

                            } else {

                                _.set(c, key, csv[t[1]].splitPlus('|'));
                            }

                            break;

                        case "Float" :
                            let ft = parseFloat(csv[t[1]]);

                            _.set(c, key, isNaN(ft) ? 0 : ft);

                            break;

                        case "Int" :

                            let n = parseInt(csv[t[1]]);

                            _.set(c, key, isNaN(n) ? 0 : n);

                            break;

                        case "Json" :
                            let json = "";
                            if (csv[t[1]] !== "") {

                                try {
                                    // Try to parse it as JSON 
                                    json = JSON.parse(csv[t[1]]);
                                } catch(e) {
                                    throw new PluginError('gulp-csv-to-json', 'ERROR: Error parsing JSON in CSV - ' + csv[t[1]]);
                                }
                            }

                            if ((json === "") && options.emptyStringAsNull) {

                                dot.remove(key, c);

                            } else {

                                _.set(c, key, json);

                            }

                            break;

                        case "String" :
                        default :
                            if ((csv[value] === "") && options.emptyStringAsNull) {

                                dot.remove(key, c);

                            } else {

                                _.set(c, key, csv[value]);

                            }

                            break;
                    }


                });

                temp.push(c);

            } catch (e) {
                throw new PluginError('gulp-csv-to-json', 'ERROR: Error during parse. ' + err);
            }
        };

        let p = this._parse(item.filePath);

        p.then( (d) => {

            _.each(d, function (csv) {
                _flatten(csv, contract);
            });

            temp = this._groupBy(temp, item, options);

            defer.resolve({
                file : item,
                data : temp
            })
        });

        return defer.promise;
    },

    _groupBy (items, conf, options) {

        const g = conf.groupBy || options.groupBy;

        if (!g) return items;

        let temp = {};

        _.each(items, (i) => {

            let prop = i[g] || "_blank_";

            temp[prop] = temp[prop] || [];

            temp[prop].push(i);
        });

        return temp;
    },

    _parse : function (file) {

        let defer = $q.defer();

        if (fs.existsSync(file)) {
            let bufferContents = fs.readFileSync(file);

            let x = csv.parse(bufferContents.toString(), {

                columns : true,
                trim : true

            }, function (e, o) {

                defer.resolve(o);
            });

        } else {
            throw new PluginError('gulp-csv-to-json', 'File not found: ' + file);
        }

        return defer.promise;
    }
};



module.exports = function(options) {

    let opt = {
        tabSize : 2,
        emptyStringAsNull : false
    };

    opt = _.extend(opt, options);

    function csvToJson(file, cb) {

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            throw new PluginError('gulp-csv-to-json', 'stream not supported');
        }

        if (file.isBuffer()) {
            C2JProcessor.init(String(file.contents), opt)
        }

        cb(null, file);
    }

    return es.map(csvToJson)
};