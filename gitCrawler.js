const Git = require("nodegit");
const url = "https://github.com/jpeng06/CPSC410_VIS.git";
var localPath = require("path").join(__dirname, "tmp");

console.log("running...");
var walker = null;

Git.Clone(url, localPath).then(function(repository) {
    console.log("cloned repo successfully under 'tmp'. delete this folder");

    walker = repository.createRevWalk();
    console.log("created walker");

    walker.pushHead();
    console.log("set walker to head. getting commits: ");

    return walker.getCommits(10);

}).then(function(commits) {
    console.log("got commits: ");
    console.log(commits);
});