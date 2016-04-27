# [gulp](http://gulpjs.com)-advanced-csv-to-json

>Converts CSV to Json object in various output. You can either do basic conversion or you can use its awesome feature
 to use your own json structure.
> This is very helpful if you have complex json structure that a basic csv to json converter cannot do.

Install :traffic_light:
-------

```bash
$ npm install gulp-advanced-csv-to-json --save
```

## Pipe :neckbeard:

Like any other gulp plugin, get source file then process all. Output file can be configured in the source file.

In your gulpfile.js

**`/gulpfile.js`**


```javascript
var gulp = require('gulp');
var aCsvToJson = require('gulp-advanced-csv-to-json');

gulp.task('bulkCsvToJsonConversion', function(){
        gulp.src('path/to/your/**/*.conf')
            .pipe(aCsvToJson({
                 tabSize : 4
             }))
```

## Config File :page_facing_up:

**`/templates/t0001.conf`**

```
[
    {
        "filePath" : "csv/002.csv"
    },
    {
        "filePath" : "csv/001.csv",
        "outputPath" : "output/001.json",
        "contract" : {
            "name" : "name",
            "profile" : {
                "age" : "Double:profile/age"
            },
            "address" : {
                "permanent" : {
                    "city" : "address/permanent/city",
                    "state" : "address/permanent/state"
                },
                "current" : "address/current"
            },
            "tags" : "Array:tags"
        }
    }
]
```
