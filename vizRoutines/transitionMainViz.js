///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function transitionMainViz()
// For many of the possible user selection changes, we don't need to re-create the whole main visualization;
// we can merely "transition" the heights and positions of the rectangles
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function transitionMainViz() {
  
  // Update the data bound to each rectangle
  // Sort to ensure departments/areas always appear in the same order
  displayBars.data(function(timeWindow) {
      return d3.keys(displayData[userOptions["serialized"]][timeWindow])
        .sort() 
        .map(function(deptOrArea) {
          return displayData[userOptions["serialized"]][timeWindow][deptOrArea];
        });
      })
      
    // Transition each rectangle into its new position and height
    // Take 1000 milliseconds to make the transition
    .transition()
    .duration(1000) 
    .attr("y", function(d) { 
      return yScaleO(d.priorDisplayValue + d.displayValue);})
    .attr("height", function(d) { 
      return yScaleO(d.priorDisplayValue) - yScaleO(d.priorDisplayValue + d.displayValue); });
  
  // Also update the data for and transition the red user select box if it exists
  var selectBox = canvas.selectAll(".selectedRect");
  if (selectBox[0].length != 0) {
    selectBoxData = displayData[userOptions["serialized"]][selectBoxTimeUnit][selectBoxDeptOrArea];
    selectBox.datum(selectBoxData)
    .transition()
    .duration(1000)
    .attr("y", function(e) {
      return bbMainVis.y + yScaleO(e.priorDisplayValue + e.displayValue);
    })
    .attr("height", function(e) {         
      return yScaleO(e.priorDisplayValue) - yScaleO(e.priorDisplayValue + e.displayValue);
    });
  }
  
  // Also update the data for and transition the subvis pie charts if they exist
  if (subVisOnScreen) {
    
    // Left pie chart is for the whole time window
    subvis1data = displayData[userOptions["serialized"]]["wholeWindow"][subvisDeptOrArea].subDisplayData.sort(function(a,b) {
      if (a.deptOrArea > b.deptOrArea) return 1;
      if (a.deptOrArea < b.deptOrArea) return -1;
      return 0;
    });
    
    // Right pie chart is for the individual selected time block
    subvis2data = displayData[userOptions["serialized"]][subvisTimeUnit][subvisDeptOrArea].subDisplayData.sort(function(a,b) {
      if (a.deptOrArea > b.deptOrArea) return 1;
      if (a.deptOrArea < b.deptOrArea) return -1;
      return 0;
    });
    transitionSubViz();
  }
  
}