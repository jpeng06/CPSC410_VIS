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

    for (let c of commits) {
        let sha = c.sha();

        let commit = await repo.getCommit(sha);

        await Git.Checkout.tree(repo, commit, { checkoutStrategy: Git.Checkout.STRATEGY.FORCE });

        let methods = await javaMethodParser.parseDir(localPath);

        fs.outputJsonSync(outputPath + commit.date() + ".json", methods);
    }

    console.log("Complete!");
}

parseRepoHistory(target, numCommits);
