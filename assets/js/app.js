var svgWidth = 960;
var svgHeight = 660;

var chartMargin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 50
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);  

d3.csv("../assets/data/data.csv")
    .then(function(csvData) { 

    csvData.forEach(function(data) {
        data.age = +data.age;
        data.poverty = +data.poverty;
    });

    var yScale = d3.scaleLinear()
        .domain([8, d3.max(csvData, data => data.poverty)])
        .range([chartHeight, 0]);

    var xScale = d3.scaleLinear()
        .domain([8, d3.max(csvData, data => data.age)])
        .range([0, chartWidth]);


    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    var plotGroup = chartGroup.selectAll("point")
        .data(csvData)
        .enter()
        .append("circle")
        .classed("point", true)
        .attr("cx", d => xScale(d.age))
        .attr("cy", d => yScale(d.poverty))
        .attr("r", 14)
        .attr("stroke", "lightblue")
        .attr("opacity", ".9")
        .attr("fill", "lightblue");

    chartGroup.selectAll("label")
        .data(csvData)
        .enter()
        .append("text")
        .classed("label", true)
        .text(d => d.abbr)
        .attr("x", d => xScale(d.age))
        .attr("y", d => yScale(d.poverty));

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 5)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("In Poverty (%)");
    
    chartGroup.append("text")
        .attr("y", chartHeight + 40)
        .attr("x", (chartWidth / 2))
        .classed("aText", true)
        .text("Age");


        var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty:  ${d.poverty}% <br>Age: ${d.age}`);
        });
    
        chartGroup.call(toolTip);
    
        plotGroup.on("click", function(data) {
            toolTip.show(data, this);
          })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            });
    
});
