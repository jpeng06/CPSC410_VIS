var width = 900,
    height = 500;

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(80)
    .size([width, height]);

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json("data.json", function(error, graph) {
    if (error) throw error;

    var nodeById = d3.map();

    graph.nodes.forEach(function(node) {
        nodeById.set(node.id, node);
    });

    graph.links.forEach(function(link) {
        link.source = nodeById.get(link.source);
        link.target = nodeById.get(link.target);
    });

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

    var nodes = svg.selectAll("g")
        .data(graph.nodes).enter()
        .append("g")
        .call(force.drag);

    nodes.append("circle")
        .attr("class", "node")
        .attr("r", function (d) { return d.size; })
        .style("fill", function(d) { return (d.id === "Main") ? "red" : "grey" });

    nodes.append("text")
        .style("fill", "black")
        .text(function(d) { return d.id; })


    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
});

