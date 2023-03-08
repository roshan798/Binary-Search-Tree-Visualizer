 export const plot = (treeData,currValue)=>{
    // console.log(treeData);
    var margin = { top: 50, right: 0, bottom: 100, left: 0 },
      width = window.innerWidth - margin.left - margin.right - 30,
      height = window.innerHeight - margin.top - margin.bottom - 150;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",`translate( ${15},${2})`),
      g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    var link = g
      .selectAll(".link")
      .data(nodes.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return (
          "M" +
          d.x +
          "," +
          d.y +
          "C" +
          d.x +
          "," +
          (d.y + d.parent.y) / 2 +
          " " +
          d.parent.x +
          "," +
          (d.y + d.parent.y) / 2 +
          " " +
          d.parent.x +
          "," +
          d.parent.y
        );
      });

    // adds each node as a group
    var node = g
      .selectAll(".node")
      .data(nodes.descendants())
      .enter()
      .append("g")
      .attr("class", function(d) {

        return "node" + (d.children ? " node--internal" : " node--leaf") + (d.data.name == currValue ? " recent" : "");
      })
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    // adds the circle to the node
    

    node.append("circle").attr("r", 20);

    // adds the text to the node
    node
      .append("text")
      .attr("dy", ".35em")
      .attr("y", function(d) {
        return 0;
      })
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.data.name;
      });
}
