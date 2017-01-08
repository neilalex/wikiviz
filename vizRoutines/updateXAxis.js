///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function updateXAxis()
// Sets the correct x-axis units and scale
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateXAxis() {  
  
  // Time unit format and x-axis tick mark intervals
  switch (userOptions["timeUnit"]) {
    case "weekly":
      xTickFormat = "%m-%d-%Y";
      xInterval = 4;      
      break;      
    case "monthly":
      xTickFormat = "%m-%Y";            
      xInterval = 1;      
      break;
    case "yearly":
      xTickFormat = "%Y";            
      xInterval = 1;       
      break;       
  }
  
  // Sort and set the x-axis scale domain
  // The slice function removes the time component (included by default in d3 dates) before sorting
  xScaleO.domain(d3.keys(displayData[userOptions["serialized"]]).filter(function(d) {
      return d != "wholeWindow";}).sort(function(a, b) {
        return d3.time.format("%b %d %Y").parse(a.slice(4,a.indexOf(":") - 3)) 
        - d3.time.format("%b %d %Y").parse(b.slice(4,b.indexOf(":") - 3));
      }));
    
  // Bind the x-axis scale to the x-axis, and set tick formats
  // Set the tick marks to appear once every 'xInterval' elements
  xAxisO.scale(xScaleO)  
  .tickFormat(function(d) { return d3.time.format(xTickFormat)(new Date(d)); })
  .tickValues(d3.keys(displayData[userOptions["serialized"]]).filter(function(d) {
      return d != "wholeWindow";}).sort(function(a, b) {
        return d3.time.format("%b %d %Y").parse(a.slice(4,a.indexOf(":") - 3)) 
        - d3.time.format("%b %d %Y").parse(b.slice(4,b.indexOf(":") - 3));
      }).filter(function(value, index, ar) { return index % xInterval == 0;}));
  
  // Display and position the x-axis
  xAxis.call(xAxisO)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
       return "rotate(-45)" 
    });
}