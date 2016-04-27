# gulp-csv-to-json
Convert CSV to Json based on contract

```
[
    {
        "filePath" : "csv/002.csv"
    },
    {
        "filePath" : "csv/001.csv",
        "contract" : {
            "name" : "name",
            "address" : {
                "permanent" : "address/permanent",
                "current" : "address/current"
            },
            "education:ObjectArray" : {
                "school" : "school_0",
                "year"  : "year_0"
            },
            "tags:Array" : "tags"
        }
    }
]
```