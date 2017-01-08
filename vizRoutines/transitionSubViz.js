///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function transitionSubViz()
// In some instances we can merely update the pie charts' data; we don't need to create the pies all over
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function transitionSubViz() {
  pie1DataSum = d3.sum(d3.values(subvis1data).map(function(d) {return d.wikiUsage;}));
  pie2DataSum = d3.sum(d3.values(subvis2data).map(function(d) {return d.wikiUsage;}));

  // Update the pie slice data
  pie1Group.data(pie1Layout(d3.entries(subvis1data).sort(function(a,b) { //Sort to ensure slices always appear in the same order
      if (a.deptOrArea > b.deptOrArea) return 1;
      if (a.deptOrArea < b.deptOrArea) return -1;
      return 0;
    })))
    
    // Gradually update the pie slice sizes and positions
    // The transition takes 1000 milliseconds
    .transition()
    .duration(1000) 
    .attrTween("d", pieArcTween) //Transitioning a pie chart requires using the special pieArcTween function. See http://bl.ocks.org/mbostock/1346410.
    .style("fill", function(d, i) {
      return pieColors(d.data.key); });
    
  // Repeat for pie 2
  pie2Group.data(pie2Layout(d3.entries(subvis2data).sort(function(a,b) {
      if (a.deptOrArea > b.deptOrArea) return 1;
      if (a.deptOrArea < b.deptOrArea) return -1;
      return 0;
    })))
    .transition().duration(1000)
    .attrTween("d", pieArcTween)
    .style("fill", function(d, i) {
      return pieColors(d.data.key); });
  
  // Display relevant on-screen stats for the pie charts
  subVisText();       
  
}