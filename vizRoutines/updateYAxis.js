///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function updateYAxis()
// Sets the correct y-axis units and scale
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateYAxis() {
  
  // Relative vs. absolute view
  if (userOptions["chartType"] == "relative") {
    yTickFormat = ".0%"
    yDomain = [0,1];
    yAxisLabelText = "Percent of total events meeting criteria"
    yAxisLabelOffset = -80;
    xAxisLabelOffset = -40;
    
  } else if (userOptions["chartType"] == "absolute") { 
    yTickFormat = null;
    
    //This value was calculated in calcRectSizesAndPositions()
    yDomain = [0, maxUsageOverAllTimeWindows*1.025]; 
    yAxisLabelText = "Number of events meeting criteria"
    yAxisLabelOffset = -100;
    xAxisLabelOffset = -85;
  }
  
  // Set the y-axis domain
  yScaleO.domain(yDomain);
  
  // Bind the y-axis scale to the y-axis, and set tick formats
  yAxisO.scale(yScaleO)
  .tickFormat(d3.format(yTickFormat));
  
  // Display the y-axis. (Its tick positions shouldn't ever need to change like the x-axis's sometimes do.)
  yAxis.call(yAxisO);
  
  // Absolute and relative views have different y-axis labels
  yAxisLabel.text(yAxisLabelText).attr("y", yAxisLabelOffset);  
  yAxisLabel.text(yAxisLabelText).attr("x", xAxisLabelOffset);  
  
}