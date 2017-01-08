///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function drawMainViz()
// Clears any main visualization graphics already on the screen, and then draws a brand new main visualization
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawMainViz() {
  canvas.selectAll(".timePeriod").remove();
  
  // If we have a need to completely re-draw the main view, then we we should clear the subvis (pie chart) as well
  clearSubViz(); 
  
  // Create a separate SVG "g" element for each time block in the display data. Each "g" represents a column of rectangles.
  timeWindows = canvas.selectAll(".timePeriod")
    .data(d3.keys(displayData[userOptions["serialized"]]).filter(function(d) {return d != "wholeWindow";}).sort(function(a, b) {
      return d3.time.format("%b %d %Y").parse(a.slice(4,a.indexOf(":") - 3)) 
      - d3.time.format("%b %d %Y").parse(b.slice(4,b.indexOf(":") - 3));
    }))
    .enter().append("g")
    .attr("class", "timePeriod")
    .attr("transform", function(d) { 
      
      // Position each column appropriately along the x-axis
      return "translate(" + String(bbMainVis.x + xScaleO(d)) + "," + String(bbMainVis.y) + ")"; }); 
  
  // Within each "g" time block column, create a rectangle for each department or area within the display data
  displayBars = timeWindows.selectAll("rect")
    .data(function(timeWindow) {
      return d3.keys(displayData[userOptions["serialized"]][timeWindow])
      
        // Sort to ensure departments/areas always appear in the same order
        .sort() 
        .map(function(deptOrArea) {
          return displayData[userOptions["serialized"]][timeWindow][deptOrArea];
        });
      })
    .enter().append("rect")
    .attr("width", xScaleO.rangeBand())
    
    // Set y and height values using the displayValue and priorDisplayValue fields calculated in calcRectSizesAndPositions()
    .attr("y", function(d) { return yScaleO(d.priorDisplayValue + d.displayValue);})
    .attr("height", function(d) { return yScaleO(d.priorDisplayValue) - yScaleO(d.priorDisplayValue + d.displayValue); })
    .style("fill", function(d) { return mainVisColors(d.deptOrArea); })
    .style("fill-opacity", "0.85");
  
  // Enable tooltip handlers for each rectangle
  displayBars.on("mouseover", function(d) {
    
    // Set the color to red for ALL rectangles of the same department/area
    displayBars.filter(function(e) { return (d.deptOrArea == e.deptOrArea);}).style("fill", "#cc0000"); 
    
    // Set the current rectangle a slightly-darker shade of red
    d3.select(this).style("fill", "#ff0000"); 
    
    // Tooltip text
    tooltip.html("<center>&nbsp;&nbsp;&nbsp;&nbsp;" + d.deptOrArea +                                      
      "&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;" + d3.time.format(xTickFormat)(d.timeUnit) + 
      "&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;" + d3.format(yTickFormat)(d.displayValue) +
      "&nbsp;&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;&nbsp;&nbsp;<i><font color=\"red\">Click mouse for" +
      "&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;more information</font></i>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;</center>");
    tooltip.style("visibility", "visible");
  })
  
  // Change tooltip position with mousemove
  .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");}) 

  // Hide the tooltip and revert colors to original
  .on("mouseout", function(d){ 
    displayBars.filter(function(e) { 
      return (d.deptOrArea == e.deptOrArea);}).style("fill", mainVisColors(d.deptOrArea));
    tooltip.style("visibility", "hidden");
  })
  
  // When clicked, surround selected rectangle with a red, dashed border and display the sub-vis pie charts
  .on("click", function(d){ 
    var selectBox = canvas.selectAll(".selectedRect");
    selectBoxDeptOrArea = d.deptOrArea;
    selectBoxTimeUnit = d.timeUnit;
    
    // Create the red rectangle if one doesn't already exist
    // Otherwise update the data of the old one
    if (selectBox[0].length == 0) { 
      selectBox = canvas
        .append("rect")
        .datum(d)
        .attr("class", "selectedRect")
        .style("fill-opacity", 0)
        .style("stroke-width", 6)
        .style("stroke", "red")
        .style("stroke-dasharray", "15, 3");
    } else {
      selectBox.datum(d);
    }
    
    // Transition the coordinates of the red rectangle
    selectBox.transition()
    .attr("width", xScaleO.rangeBand())
    .attr("y", function(e) {
      return bbMainVis.y + yScaleO(e.priorDisplayValue + e.displayValue);
    })
    .attr("x", function(e) {
      return bbMainVis.x + xScaleO(e.timeUnit);
    })
    .attr("height", function(e) {         
      return yScaleO(e.priorDisplayValue) - yScaleO(e.priorDisplayValue + e.displayValue);
    })
    
    // Assemble data for the sub-visualization pie charts, taken from the particular department/area the user clicked upon
    // subvisdata1 = left pie chart shows data from the whole window
    // subvisdata2 = right pie chart shows data from the specific retangle the user clicked upon
    subvisDeptOrArea = d.deptOrArea;
    subvisTimeUnit = d.timeUnit;
    subvis1data = displayData[userOptions["serialized"]]["wholeWindow"][subvisDeptOrArea].subDisplayData; 
    subvis2data = d.subDisplayData; 
    
    // If there's already a set of pie charts on the screen, merely transition them. Otherwise draw them entirely.
    if (!subVisOnScreen) {
      drawSubViz();
    } else {
      transitionSubViz();
    }
    
  })
  
  // For the yearly view, write a special note warning that it only counts data the user selected, 
  // which may not cover the full years
  if (userOptions["timeUnit"] == "yearly") {
    d3.select("#belowVisText").html("<center><i><font size=\"2\">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Note: only events between " 
      + d3.time.format("%m-%d-%Y")(startDate) + " and " + d3.time.format("%m-%d-%Y")(endDate) 
      + " are counted. To change this, change the \"load data starting/stopping\" dates above.</center></i></font>");
  } else {
    d3.select("#belowVisText").html("");
  }
  
}