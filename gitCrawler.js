// MARK: - gitCrawler.js

// this program takes in a repo URL and iterates through a number of commits.
// initially, a tmp directory is created to store current state of branch.
// then it walks from first commit until the last commit, replacing tmp with that commit each iteration.

// USAGE: run "node gitCrawler.js" in working directory. ensure that tmp folder has been removed prior.
// Note: current state fails occasionally. likely an ASYNC issue. if it fails, just delete tmp and try again for now.


// set up variables. currently grabbing repo from a hardcoded URL; could change this to a command line argument/other.
const Git = require("nodegit");

const url = "https://github.com/jpeng06/CPSC410_VIS.git";     // repo to clone
const localPath = require("path").join(__dirname, "tmp");       // where we want to put tmp
const maxCommits = 30;                                          // max # of commits to go back to.
let currentCommit = null;

// initialize our walker and repo. program fails if tmp has not been deleted.
console.log("running... if no output, ensure 'tmp' folder is deleted & run again.");
let walker = null;
let currentRepo = null;

// clone the repo at its current state.
Git.Clone(url, localPath).then(function(repository) {
    currentRepo = repository;
    console.log("cloned repo successfully under 'tmp'.");

    // this "walker" will collect SHA #'s for us to identify individual commits with later on:
    walker = repository.createRevWalk();
    console.log("created walker");

    // we need to set the walker to head before it can traverse the tree:
    walker.pushHead();
    console.log("walker placed on head. getting commits: ");

    // now lets return a simple array containing sha's from commit history:
    return walker.getCommits(maxCommits);

}).then(function(commits) {

    // log number of commits for debugging (segfaults can occur here):
    console.log("commit history retrieved... working...");
    console.log(commits.length);

    // finally we can iterate through each commit.
    for(let i = (commits.length - 1); i >= 0; i--) {
        const sha = commits[i].sha();
        currentCommit = commits[i];

        currentRepo.getCommit(sha).then(function(commit) {
            console.log("checking out commit: " + sha);
            Git.Checkout.tree(currentRepo, commit, {checkoutStrategy: Git.Checkout.STRATEGY.SAFE}).then(function() {
                // DO THINGS + STUFF...
                // ...
                // ...
                console.log("success.");
            });
        });
    }

    // fin.
    console.log("all done.");
});