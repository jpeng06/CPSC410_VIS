const Git = require("nodegit");
const url = "https://github.com/jpeng06/CPSC410_VIS.git";
var localPath = require("path").join(__dirname, "tmp");

console.log("running... if no output, ensure 'tmp' folder is deleted & run again.");
var walker = null;
var currentRepo = null;

Git.Clone(url, localPath).then(function(repository) {
    currentRepo = repository;
    console.log("cloned repo successfully under 'tmp'. delete this folder");

    walker = repository.createRevWalk();
    console.log("created walker");

    walker.pushHead();
    console.log("set walker to head. getting commits: ");

    return walker.getCommits(10);

}).then(function(commits) {
    console.log("got commits: ");

    for(var i = 0; i < commits.length; i++) {
        console.log("listing SHA's: " + commits[i].sha());
    }

    // currently... apparently "getting" a commit, but documentation is... scant. No idea how to replace
    // tmp with current commit, or if that's even possible.
    currentRepo.getCommit(commits[commits.length - 1].sha()).then(function(thing) {
        thing
    });
    console.log("wooo.");
});

