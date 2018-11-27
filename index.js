const fs = require('fs');
const directory = process.argv[2];
const javpar = require('java-parser');

let methods = {};

console.log('Analyzing directory: ' + directory);

function findMethodInvocation(currMethod, element) {
    if (typeof element !== 'object') return;

    if (element.node === 'MethodInvocation') {
        //console.log("GOT ONE: " + currMethod + " calls " + element.name.identifier);
        let name = element.name.identifier;
        if (methods[currMethod].calls.hasOwnProperty(name)) {
            let currentCallNum = methods[currMethod].calls[name];
            methods[currMethod].calls[name] = currentCallNum + 1;
        } else {
            methods[currMethod].calls[name] = 1;
        }
    }

    Object.entries(element).forEach(([key, val]) => {
        if (val) {
            findMethodInvocation(currMethod, val);
        }
    });
}

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
                       let methodName = bodyDec.name.identifier;
                       let methodSize = bodyDec.body.statements.length;
                       methods[methodName] = { size: methodSize, calls: {} };
                       for (let statement of bodyDec.body.statements) {
                           findMethodInvocation(methodName, statement);
                       }
                   }
               }
           }

           console.log(methods);
        });
    }
});