const fs = require('fs');
const directory = process.argv[2];
const javpar = require('java-parser');

console.log("Analyzing directory: " + directory);

fs.readdir(directory, (err, files) => {

    if (err) throw err;

    for (let file of files) {
        fs.readFile(directory + file, (err, contentBuffer) => {
           if (err) throw err;

           let content = contentBuffer.toString();

           let x = javpar.parse(content);

           for (let type of x.types) {
               for (let bodyDec of type.bodyDeclarations) {
                   if (bodyDec.node === 'MethodDeclaration') {
                       console.log(bodyDec.name.identifier);
                   }
               }
           }
        });
    }

});