const Git = require("nodegit");
const fs = require('fs-extra');
const javaMethodParser = require('./javaMethodParser');

const localPath = require("path").join(__dirname, "tmp/");       // where we want to put tmp
const maxCommits = 30;                                          // max # of commits to go back to.

let target = process.argv[2];

async function parseRepoHistory(target) {
    if (fs.pathExistsSync(localPath)) {
        fs.removeSync(localPath);
    }

    let repo = await Git.Clone(target, localPath);

    let walker = repo.createRevWalk();
    walker.sorting(4);
    walker.pushHead();
    let commits = await walker.getCommits(maxCommits);

    let history = [];

    for (let c of commits) {
        let sha = c.sha();

        console.log(sha);

        let commit = await repo.getCommit(sha);

        await Git.Checkout.tree(repo, commit, { checkoutStrategy: Git.Checkout.STRATEGY.FORCE });

        let methods = await javaMethodParser.parseDir(localPath);

        console.log(methods);
        // add to history
    }

    return history;
}

parseRepoHistory(target);
