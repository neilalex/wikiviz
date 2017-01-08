///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function drawSubViz()
// Draws a set of drill-down pie charts after the user clicks a rectangle in the main visualization
//
// Notes:
// Throughout this function, pie 1 is the pie on the left, with stats for the whole time window
// Pie 2 is on the right with stats for the specific time block the user selected
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
function drawSubViz() {
  
  // Keep track of whether the pie charts are displayed
  subVisOnScreen = true; 
  
  // Calculate totals from which each slice takes a percentage
  pie1DataSum = d3.sum(d3.values(subvis1data).map(function(d) {return d.wikiUsage;}));
  pie2DataSum = d3.sum(d3.values(subvis2data).map(function(d) {return d.wikiUsage;}));
  
  // D3 pie radius
  pieArc = d3.svg.arc().outerRadius(60); 
  
  // D3 pie layout
  pie1Layout = d3.layout.pie().value(function(d) { 
    if (pie1DataSum == 0) return 0;
    else return (d.value.wikiUsage / pie1DataSum);
  }).sort(null);
  
  pie2Layout = d3.layout.pie().value(function(d) {
    if (pie2DataSum == 0) return 0;
    else return (d.value.wikiUsage / pie2DataSum);
  }).sort(null);
    
  // Remove any existing pie charts
  subCanvas1.selectAll(".arc").remove();
  subCanvas2.selectAll(".arc").remove();
  
  // Bind data to the pie chart, and position the pie chart on the screen
  // Sort to ensure slices always appear in the same order
  pie1Group = subCanvas1.selectAll(".arc")
    .data(pie1Layout(d3.entries(subvis1data).sort(function(a,b) { 
      if (a.deptOrArea > b.deptOrArea) return 1;
      if (a.deptOrArea < b.deptOrArea) return -1;
      return 0;
    }))) 
    .enter().append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + String(bbSubVis.w/2) + "," + String(bbSubVis.h/2) + ")")
    .append("path");
    
  // Draw the pie chart using the SVG "d" attribute  
  // Store the angles in case we need to transition them later
  pie1Group
    .style("fill", function(d, i) {
      return pieColors(d.data.key);})
    .attr("d", pieArc)
    .each(function(d) { this._current = d; }); 
      
  // Repeat for pie 2
  pie2Group = subCanvas2.selectAll(".arc")
    .data(pie2Layout(d3.entries(subvis2data).sort(function(a,b) {
      if (a.deptOrArea > b.deptOrArea) return 1;
      if (a.deptOrArea < b.deptOrArea) return -1;
      return 0;
    }))) 
    .enter().append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + String(bbSubVis.w/2) + "," + String(bbSubVis.h/2) + ")")
    .append("path");
    
  pie2Group
    .style("fill", function(d, i) {
      return pieColors(d.data.key); })
    .attr("d", pieArc)
    
    // Store the initial angles
    .each(function(d) { this._current = d; }); 
    
  // Create tooltip handlers for the pie slices: pie 1
  pie1Group.on("mouseover", function(d){
    d3.select(this).style("fill", "red");
    tooltip.html("<center>&nbsp;&nbsp;&nbsp;&nbsp;" + d.data.key + "&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;" 
      + d3.format(".0%")(d.value) + "&nbsp;&nbsp;&nbsp;&nbsp;</center>");
    tooltip.style("visibility", "visible");
  })
  .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
  .on("mouseout", function(d){
    d3.select(this).style("fill", pieColors(d.data.key));
    tooltip.style("visibility", "hidden");
  })
  
  // Create tooltip handlers for the pie slices: pie 2
  pie2Group.on("mouseover", function(d){
    d3.select(this).style("fill", "red");
    tooltip.html("<center>&nbsp;&nbsp;&nbsp;&nbsp;" + d.data.key + "&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;" 
      + d3.format(".0%")(d.value) + "&nbsp;&nbsp;&nbsp;&nbsp;</center>");
    tooltip.style("visibility", "visible");
  })
  .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
  .on("mouseout", function(d){
    d3.select(this).style("fill", pieColors(d.data.key));
    tooltip.style("visibility", "hidden");
  })
  
  // Display relevant on-screen stats for the pie charts
  subVisText();
}