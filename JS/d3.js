export const plot = (treeData, currValue,isInserting) => {
  var margin = { top: 50, right: 10, bottom: 50, left: 10 },
    width = window.innerWidth - margin.left - margin.right - 250 + ((window.innerWidth >= 760) ? 0 : 70),
    height = window.innerHeight - margin.top - margin.bottom - 100;
  var treemap = d3.tree().size([width, height]);
  var nodes = d3.hierarchy(treeData);
  nodes = treemap(nodes);
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", `translate( ${150 +((window.innerWidth >= 760) ? 80 : 10)},${0})`),
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  addLink(g,nodes,currValue,isInserting);
  addNode(g,nodes, currValue,isInserting);
};
function addNode(g,nodes, currValue,isInserting) {
  var node = g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr("class", function (d) {
      return "node" + (d.children ? " node--internal" : " node--leaf") + (d.data.name == currValue ? " recent" : "");
    })
    .attr("transform", function (d) {
      if (isInserting==true && d.parent && d.data.name == currValue) {
        return "translate(" + d.parent.x + "," + d.parent.y + ")";
      } else {
        return "translate(" + d.x + "," + d.y + ")";
      }
    });
  node
    .transition()
    .duration(1000)
    .attr("transform", d => {
      return "translate(" + d.x + "," + d.y + ")";
    });
  node.append("circle")
    .attr("r", function (d) {
      return d.data.name == currValue ? 5 : 20;
    })
    .transition()
    .duration(function (d) {
      return d.data.name == currValue ? 500 : 0;
    })
    .attr("r", d=>{
      if(Math.abs(d.data.name) > 1000) return 25;
      return 20;
    });

  node
    .append("text")
    .attr("dy", ".35em")
    .attr("y", function (d) {
      return 0;
    })
    .style("text-anchor", "middle")
    .text(function (d) {
      return d.data.name;
    });
}

function addLink(g,nodes,currValue,isInserting) {
  var link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", function (d) {
      return "link" + (d.data.name == currValue ? " recent" : "");
    })
    .attr("d", function (d) {
      let s;
      if (isInserting==true && d.data.name == currValue) {
        s = (
          "M" +
          d.parent.x +
          "," +
          d.parent.y +
          "C" +
          d.parent.x +
          "," +
          d.parent.y +
          " " +
          d.parent.x +
          "," +
          d.parent.y +
          " " +
          d.parent.x +
          "," +
          d.parent.y
        );
      }
      else {
        s = (
          "M" +
          d.parent.x +
          "," +
          d.parent.y +
          "C" +
          d.parent.x +
          "," +
          (d.y + d.parent.y) / 2 +
          " " +
          d.x +
          "," +
          (d.y + d.parent.y) / 2 +
          " " +
          d.x +
          "," +
          d.y
        );
      }
      return s;
    });
  addLinkTransition(link,currValue);

}
function addLinkTransition(link,currValue) {
  link.transition()
    .duration(1000)
    .attr("d", function (d) {
      let s = (
        "M" +
        d.parent.x +
        "," +
        d.parent.y +
        "C" +
        d.parent.x +
        "," +
        (d.y + d.parent.y) / 2 +
        " " +
        d.x +
        "," +
        (d.y + d.parent.y) / 2 +
        " " +
        d.x +
        "," +
        d.y
      );
      return s;
    });
}