const fs = require('fs');
const directory = process.argv[2];

console.log("Analyzing directory: " + directory);

fs.readdir(directory, (err, files) => {
    console.log("Reading...");
    if (!err) {
        console.log("No error.");
        for (let file of files) {
            console.log(file);
        }
    } else {
        console.log(err);
    }
});