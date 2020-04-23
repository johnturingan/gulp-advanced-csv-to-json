# [gulp](http://gulpjs.com)-advanced-csv-to-json

> Converts CSV to JSON object in various output. You can either do basic conversion or you can use its awesome feature to use your own JSON structure.
> This is very helpful if you have complex JSON structure that a basic CSV to JSON converter cannot do.

Install :traffic_light:
-------

```bash
$ npm install gulp-advanced-csv-to-json --save
```

## Pipe :neckbeard:

Like any other gulp plugin, get source file, then process all. Output file can be configured in the source file.

In your gulpfile.js:

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

### CONFIG FILE :page_facing_up:

**`/path/to/*.conf`**

```json
[
    {
        "filePath" : "csv/002.csv"
    },
    {
        "filePath" : "csv/001.csv",
        "outputPath" : "output/001.json",
        "groupBy": "gender",
        "contract" : {
            "name" : "name",
            "gender": "gender",
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

Sometimes you may want to use same contract to all the csv files that you want to convert. **YOU CAN!** You just need to modify your config file a little bit. Here's how your config file would look like:

```json
{
    "globalContract" : {
       "name" : "name",
       "gender": "gender",
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
            "filePath" : "csv/001.csv",
            "outputPath" : "output/T002-privateGlobalContract.json",
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
        },
        {
            "filePath" : "csv/001.csv",
            "outputPath" : "output/T002-noGlobalContract.json",
            "contract" : false
        },
        {
            "filePath" : "csv/002.csv",
            "outputPath" : "output/T002-GlobalContract.json",
            "contract" : true
        },
        {
            "filePath" : "csv/003.csv",
            "outputPath" : "output/T003-noGlobalContract.json",
            "groupBy": "school_0",
            "contract" : false
        },
        {
            "filePath" : "csv/003.csv",
            "outputPath" : "output/T003-GlobalContract.json",
            "contract" : true
        }
    ]
}
```

The **contract** property lets you decide, whether or not to use the global contract, private contract or just no contract at all. Possible values are: 

To use Global Contract:

```
"contract": true
```

To use Private Contract: 

```
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
```

Don't want to use any:

```
"contract": false
```
or just omit the contract property

### CSV FILE :page_facing_up:

**`/path/to/*.csv`**

```csv
name, address/permanent/city, address/permanent/state, address/current, school_0, year_0, school_1, year_1,tags
Juan Dela Cruz, Quezon city, Metro Manila, Makati city,DPS,1997,PSU,2001,a|b|c
John Doe, Puerto Princesa city, Metro Manila, Palawan, Oxford,1993, Harvard,2003,t1|t2|t3
```

## How it Works :wrench:

Advanced Csv to Json will fetch the config file and process all items. It will read the CSV file that you declared and check if there's a desired contract that you want to use. If there's none, it will just convert the CSV to a flat JSON object. If there is, it will use the structure and match all values of the JSON to the CSV.

Notice that you can declare the value to be an Array, Float, Int, Json, or String (default is String).

```text
{
    key : [dataType]:[csvValue]
}
```

If you look at the JSON and CSV closely:

**`json`**

```json
"tags" : "Array:tags"
```

**`csv`**

```text
a|b|c
```

You may notice that the convention for Array:tags is pipe delimited values. You may also set the datatype of the values of the array. Let's say you want the array of int or array of float default is string), you can do that by declaring your desired type like this:

**`int`**

```text
"tags" : "Array:{int}tags"
```

**`float`**

```text
"tags" : "Array:{float}tags"
```

You can also include JSON itself in your CSV files, which can be useful for representing more complicated JSON structures such as arrays of objects. Power Query in Microsoft Excel, for example, can create arbitrarily complex JSON which you can then export in CSV files. See the t0003.conf template and 003.csv in the demos folder for an example of how to use this.

**`json`**

```text
"degreeInfo" : "Json:degree_info"
```

## Options :radio_button:

### CONFIG FILE

There are options you may use for the config file.

- **`BASIC CONFIG`**
  - filePath [`String`] - Required :red_circle:
  - outputPath [`String`] - Optional ```(default: output/{your-csv-filename}.json)```
  - groupBy: [`String`] - Optional 
  - contract [`Object`] - Optional ```(default: flat json conversion)```
- **`CONFIG USING GLOBAL CONTRACT`**
  - globalContract [`Object`] - Required :red_circle:
  - groupBy: [`String`] - Optional 
  - contract -  Optional

### aCsvToJson

There are 3 options you can use with this module.

- ***tabSize*** - Your preferred tab size for the JSON you generate.
- ***emptyStringAsNull*** - (Boolean) If true, JSON will not be generated if the value in the CSV column is blank (empty string, ""). This can be helpful when the CSV file you are generating from contains a lot of null/empty values, because the resulting JSON will be significantly smaller.
- ***groupBy*** (optional) - Lets you group the items based on value of the property you set. This settings is global, if you want to more specific, use **groupBy** in the config file not here.

## Running the DEMO :neckbeard:

You may want to test the demo. Here's how to run it.

```bash
cd /to/demo/folder
npm install
gulp convert
```

### NOTE

If you find any bugs or you have some ideas in mind that would make this better. Please don't hesitate to send comment on github.

----
**[MIT](LICENSE) LICENSE** <br>
copyright &copy; 2020 Scripts and Pixels.
