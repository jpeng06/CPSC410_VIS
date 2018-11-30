
var width = parseInt(d3.select("#visualization").style("width")),
    height = parseInt(d3.select("#visualization").style("height"));

function doD3(path) {
    var force = d3.layout.force()
        .charge(function(d) {
            console.log(d.size);
            return -300 * (d.size * 0.1)
        })
        .linkDistance(120)
        .size([width, height]);

    var svg = d3.select("#visualization").append("svg")
        .attr("width", width)
        .attr("height", height);

    var color1 = d3.rgb(1, 101, 169),
        color2= d3.rgb(110, 194, 255);

    d3.json(path, function(error, graph) {
        if (error) throw error;

        var nodeById = d3.map();
        var maxSize = 0;
        graph.nodes.forEach(function(node) {
            if (node.size > maxSize) maxSize = node.size;
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
            .style("fill", function(d) {
                if (d.size > maxSize) return color1.darker(1);
                else if (d.size > maxSize*0.75) return color1;
                else if (d.size > maxSize/2) return color2;
                else if (d.size > maxSize/4) return "lightblue";
                else return "lightgrey";
                //return (d.id === "Main") ? "red" : "grey"
            });

        nodes.append("text")
            .style("fill", "black")
            .style("font-size", function (d) {
                return (d.size * 0.8 > 10) ? d.size * 0.8 : 10;
            })
            .style("font-weight", function (d) {
                if (d.size > maxSize) return 900;
                else if (d.size > maxSize*0.75) return 700;
                else return 400;
            })
            .text(function(d) { return d.id; });


        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            nodes.attr("transform", function(d) { return "translate(" + (d.x = Math.max(50, Math.min(width, d.x))) + ","
                + (d.y = Math.max(50, Math.min(height, d.y))) + ")"; });
        });

    });
}

doD3("output/[0]2018-10-06.json");