const Git = require("nodegit");
const fs = require('fs-extra');
const javaMethodParser = require('./javaMethodParser');

const localPath = require("path").join(__dirname, "tmp/");       // where we want to put tmp
const outputPath = require("path").join(__dirname, "output/");

let target = process.argv[2];
let numCommits = process.argv[3];

async function parseRepoHistory(target, numCommits) {
    console.log("Processing... This may take some time.");
    if (fs.pathExistsSync(localPath)) {
        fs.removeSync(localPath);
    }

    let repo = await Git.Clone(target, localPath);

    let walker = repo.createRevWalk();
    walker.sorting(4);
    walker.pushHead();
    let commits = await walker.getCommits(numCommits);

    if (fs.pathExistsSync(outputPath)) {
        fs.removeSync(outputPath);
    }
    
    var count = 0;
    for (let c of commits) {
        let sha = c.sha();
        
        console.log("Downloading Commit: "+sha);

        let commit = await repo.getCommit(sha);
        
        console.log("start analyzing...");

        await Git.Checkout.tree(repo, commit, { checkoutStrategy: Git.Checkout.STRATEGY.FORCE });
        
        console.log("parsing");

        let methods = await javaMethodParser.parseDir(localPath);
        
        console.log("done");
        
        console.log("Commit saved as " + outputPath + "["+count+"]" + commit.date().toLocaleDateString() + ".json");

        fs.outputJsonSync(outputPath + "["+count+"]" + commit.date().toLocaleDateString() + ".json", methods);
        count++;
        
    }

    console.log(count + " commits analyzed and parsed successfully!");
}

parseRepoHistory(target, numCommits);
