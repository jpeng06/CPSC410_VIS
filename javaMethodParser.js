const fs = require('fs');
const javpar = require('java-parser');
const { promisify } = require('util');

let classFieldDeclarations = {};
let localVariableDeclarations = {};

// Unfinished function to handle inheritance
// function findMethodInvocationsToSuper(className, currMethod, methodName, element) {
//     for (let superType of element.superclassType) {
//         let superTypeName = superType.name.identifier;
//         if (methods.nodes.find(x => x.id === superTypeName + "." + methodName)) {
//             let methodLinkInfo = { source: className + "." + currMethod, target: superTypeName + "." + methodName };
//             methods.links.push(methodLinkInfo);
//         }
//     }
// }

function findMethodInvocations(className, currMethod, element) {
    if (typeof element !== 'object') return;

    if (element.node === 'MethodInvocation') {
        let methodName = element.name.identifier;

        if (element.expression && element.expression.identifier) {
            let objectName = element.expression.identifier;

            let localVariableDeclaration = className + "." + currMethod + "." + objectName;
            if (localVariableDeclarations.hasOwnProperty(localVariableDeclaration)) {
                let type = localVariableDeclarations[localVariableDeclaration];

                if (methods.nodes.find(x => x.id === type + "." + methodName) &&
                    !methods.links.find(y => y.source === className + "." + currMethod && y.target === type + "." + methodName)) {
                    let methodLinkInfo = { source: className + "." + currMethod, target: type + "." + methodName };
                    methods.links.push(methodLinkInfo);
                }
            } else if (classFieldDeclarations.hasOwnProperty(className + "." + objectName)) {
                let type = classFieldDeclarations[className + "." + objectName];

                if (methods.nodes.find(x => x.id === type + "." + methodName) &&
                    !methods.links.find(y => y.source === className + "." + currMethod && y.target === type + "." + methodName)) {
                    let methodLinkInfo = { source: className + "." + currMethod, target: type + "." + methodName };
                    methods.links.push(methodLinkInfo);

                }
            }
        } else {

            if (methods.nodes.find(x => x.id === className + "." + methodName) &&
                !methods.links.find(y => y.source === className + "." + currMethod && y.target === className + "." + methodName)) {
                let methodLinkInfo = { source: className + "." + currMethod, target: className + "." + methodName };
                methods.links.push(methodLinkInfo);
            }
        }
    }

    Object.entries(element).forEach(([key, val]) => {
        if (val) {
            findMethodInvocations(className, currMethod, val);
        }
    });
}

function findMethodLengths(statement) {
    if (typeof statement !== 'object') return;

    Object.entries(statement).forEach(([key, val]) => {
        if (val) {
            if (key === 'statements') {
                numLines += val.length;
            }
            findMethodLengths(val);
        }
    });
}

function findFieldDeclarations(className, element) {
    if (typeof element !== 'object') return;

    if (element.node === 'FieldDeclaration') {
        if (element.fragments[0].hasOwnProperty('name') && element.type.hasOwnProperty('name')) {
            let name = element.fragments[0].name.identifier;
            let type = element.type.name.identifier;

            // console.log("Linking " + className + "." + name + " with " + type);

            classFieldDeclarations[className + "." + name] = type;
        }
    }

    Object.entries(element).forEach(([key, val]) => {
        if (val) {
            findFieldDeclarations(className, val);
        }
    });
}

function findLocalVariableDeclarations(className, methodName, element) {
    if (typeof element !== 'object') return;

    if (element.node === 'VariableDeclarationStatement') {
        if (element.fragments[0].hasOwnProperty('name') && element.type.hasOwnProperty('name')) {
            let name = element.fragments[0].name.identifier;
            let type = element.type.name.identifier;

            // console.log("Linking " + className + "." + methodName + "." + name + " with " + type);

            localVariableDeclarations[className + "." + methodName + "." + name] = type;
        }
    }

    Object.entries(element).forEach(([key, val]) => {
        if (val) {
            findFieldDeclarations(className, val);
        }
    });
}

async function parseDirectory(path) {
    let entries;

    try {
        let readdir = promisify(fs.readdir);
        entries = await readdir(path);
    } catch (err) {
        throw err;
    }

    for (let entry of entries) {

        // console.log(entry);

        if (fs.lstatSync(path + entry).isFile()) {

            let extension = entry.slice((entry.lastIndexOf(".") - 1 >>> 0) + 2);

            if (extension === 'java') {

                // console.log("JAVA FILE! " + entry);

                let contentBuffer;

                try {
                    let readFile = promisify(fs.readFile);
                    contentBuffer = await readFile(path + entry);
                } catch (err) {
                    throw err;
                }

                let content = contentBuffer.toString();

                let x = javpar.parse(content);

                for (let type of x.types) {
                    for (let bodyDec of type.bodyDeclarations) {
                        let className = type.name.identifier;

                        findFieldDeclarations(className, bodyDec);
                    }
                }

                for (let type of x.types) {

                    let className = type.name.identifier;

                    for (let bodyDec of type.bodyDeclarations) {
                        if (bodyDec.node === 'MethodDeclaration') {
                            let methodName = bodyDec.name.identifier;

                            if (bodyDec.body) {

                                for (let statement of bodyDec.body.statements) {
                                    findLocalVariableDeclarations(className, methodName, statement);
                                }
                            }
                        }
                    }
                }

                for (let type of x.types) {

                    let className = type.name.identifier;

                    // Build nodes
                    for (let bodyDec of type.bodyDeclarations) {
                        if (bodyDec.node === 'MethodDeclaration') {
                            let methodName = bodyDec.name.identifier;

                            if (!methods.nodes.find(x => x.id === className + "." + methodName)) {
                                if (bodyDec.body) {

                                    for (let statement of bodyDec.body.statements) {
                                        numLines++;
                                        findMethodLengths(statement);
                                    }

                                    let methodSizeInfo = { id: className + "." + methodName, size: numLines };
                                    methods.nodes.push(methodSizeInfo);

                                    numLines = 0;
                                }
                            }
                        }
                    }

                    // Build links
                    for (let bodyDec of type.bodyDeclarations) {
                        if (bodyDec.node === 'MethodDeclaration') {
                            let methodName = bodyDec.name.identifier;

                            if (bodyDec.body) {
                                for (let statement of bodyDec.body.statements) {
                                    findMethodInvocations(className, methodName, statement);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            await parseDirectory(path + entry + "/");
        }
    }
}

let numLines = 0;

let methods = { nodes: [], links: [] };

exports.parseDir = async function (target) {
    await parseDirectory(target);
    return methods;
};
