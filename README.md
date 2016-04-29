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

## USAGE :white_check_mark:

####CONFIG FILE :page_facing_up:


**`/path/to/*.conf`**


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
                "age" : "Float:profile/age"
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

Sometimes you may want to use same contract to all the csv file that you want to convert. **YOU CAN!** You just need to modify your config file a little bit. Here's how your config file would look like.

```
{
    "globalContract" : {
        "name" : "name",
        "profile" : {
            "age" : "Float:profile/age"
        },
        "address" : {
            "permanent" : {
                "city" : "address/permanent/city",
                "state" : "address/permanent/state"
            },
            "current" : "address/current"
        },
        "tags" : "Array:tags"
    },
    "list" : [
        {
            "filePath" : "csv/002.csv",
            "useGlobalContract" : false
        },
        {
            "filePath" : "csv/001.csv",
            "outputPath" : "output/001.json",
            "useGlobalContract" : true
        }
    ]
}
```

Notice that there is **useGlobalContract** property that you set to boolean. If you set to `false`, and you don't have a **contract** property, it will convert the csv to flat json. But, if you set it to `false` and you declare **contract**, it will use it instead of the **globalContract**. If you set it to `true`, then ofcourse it will use the global contract you set above.

#### CSV FILE :page_facing_up:

**`/path/to/*.csv`**

```

name, address/permanent/city, address/permanent/state, address/current, school_0, year_0, school_1, year_1,tags
Juan Dela Cruz, Quezon city, Metro Manila, Makati city,DPS,1997,PSU,2001,a|b|c
John Doe, Puerto Princesa city, Metro Manila, Palawan, Oxford,1993, Harvard,2003,t1|t2|t3

```

## How it Works :wrench:

Advanced Csv to Json will fetch the config file and process all items. It will read the CSV file that you declared and
check if there's a desired contract that you want to use. If there's none, it will just convert the csv to a flat JSON
object. If there is, it will use the structure and match all values of the JSON to the CSV.

Notice that you can declare the value to be an Array or Float (default is String).

```
{
    key : [dataType]:[csvValue]
}

```

If you look at the json and csv closer

**`json`**
```
"tags" : "Array:tags"
```
**`csv`**

```
a|b|c
```

you may notice that the convention for Array:tags is pipe delimited values. You may also set the datatype of the values
of the array. Lets say you want the array of int or array of float (default is string), you can do that by declaring your
desired type like this:

**`int`**
```
"tags" : "Array:{int}tags"
```

**`float`**
```
"tags" : "Array:{float}tags"
```

## Options :radio_button:


**`CONFIG FILE - `**

There are 3 options you may use for the config file.

- **`BASIC CONFIG`**
    - filePath [`String`] - Required :red_circle:
    - outputPath [`String`] - Optional ```(default: output/{your-csv-filename}.json)```
    - contract [`Object`] - Optional ```(default: flat json conversion)```
- **`CONFIG USING GLOBAL CONTRACT`**
    - globalContract [`Object`] - Required :red_circle:
    - useGlobalContract [`Boolean`] -  Required :red_circle:

**`aCsvToJson - `**

Currently there's only one option you can use for this module.

- tabSize - Your preferred tab size for the JSON.



## Running the DEMO :neckbeard:
You may want to test the demo. Here's how to run it.
```
cd /to/demo/folder
npm install
gulp convert
```


**`NOTE:`**

If you find any bugs or you have some ideas in mind that would make this better. Please don't hesitate to send comment on github.

----
**[MIT](LICENSE) LICENSE** <br>
copyright &copy; 2016 Scripts and Pixels.
