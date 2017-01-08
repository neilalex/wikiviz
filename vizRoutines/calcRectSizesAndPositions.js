///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function calcRectSizesAndPositions()
// Calculates the y-position and height of each rectangle in the stacked column chart
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calcRectSizesAndPositions() {
  
  // Determine which departments or areas the user selected to view
  var selectedDeptsOrAreas = Array.prototype.slice.call(liveDisplayChooser.selectedOptions); 
  
  // Find *total* event count across selected departments or areas (so we can calculate the relative height of each rectangle)
  var totalWikiUsage = [];
  d3.keys(displayData[userOptions["serialized"]]).sort().filter(function(timeWindow) {
      return timeWindow != "wholeWindow";
  })
  .forEach(function(timeWindow) {
    totalWikiUsage[timeWindow] = 0;
    d3.keys(displayData[userOptions["serialized"]][timeWindow]).forEach(function(deptOrArea) {
      if (selectedDeptsOrAreas.some(function(selectedUnit) {
    
        // Only count the department or area if the user selected it
        return selectedUnit.text == deptOrArea
      })) { 
        totalWikiUsage[timeWindow] += displayData[userOptions["serialized"]][timeWindow][deptOrArea].wikiUsage;
      }
    })
  })
  
  // Used for the "absolute" chart type, which calculates rect heights relative to the greatest across *all* time blocks
  maxUsageOverAllTimeWindows = d3.max(d3.values(totalWikiUsage)); 
  
  // Calculate a display value for each rectangle
  // For the relative view, this is the percentage of total usage in the given time block
  // For the absolute view, this is merely the wikiUsage originally calculated
  // D3's scales (applied below) convert these values to pixel counts
  // Also keep track of the display value of each immediately-prior rectangle, 
  // which will be the starting value of the current rectangle
  var priorDisplayValue;
  d3.keys(displayData[userOptions["serialized"]]).sort().forEach(function(timeWindow) { 
    priorDisplayValue = 0;
    
    // Sort so that departments are ordered consistently across all views. Default D3 sort is alphabetical.
    d3.keys(displayData[userOptions["serialized"]][timeWindow]).sort().forEach(function(deptOrArea) { 
      displayData[userOptions["serialized"]][timeWindow][deptOrArea].deptOrArea = deptOrArea;
      displayData[userOptions["serialized"]][timeWindow][deptOrArea].priorDisplayValue = priorDisplayValue;
      if (selectedDeptsOrAreas.some(function(selectedUnit) { 
        
        // Only display the department or area if the user selected it
        return selectedUnit.text == deptOrArea})) { 
        if (userOptions["chartType"] == "relative") {
          
          // Handle division by zero if there were no events meeting the user's criteria                
          if (totalWikiUsage[timeWindow] != 0) { 
            displayData[userOptions["serialized"]][timeWindow][deptOrArea].displayValue 
              = displayData[userOptions["serialized"]][timeWindow][deptOrArea].wikiUsage / totalWikiUsage[timeWindow];
          } else {
            displayData[userOptions["serialized"]][timeWindow][deptOrArea].displayValue = 0;
          }
        } else if (userOptions["chartType"] == "absolute") {
          displayData[userOptions["serialized"]][timeWindow][deptOrArea].displayValue 
            = displayData[userOptions["serialized"]][timeWindow][deptOrArea].wikiUsage;
        }
      } else {
        
        // Only display the department or area if the user selected it
        displayData[userOptions["serialized"]][timeWindow][deptOrArea].displayValue = 0; 
      }
      priorDisplayValue += displayData[userOptions["serialized"]][timeWindow][deptOrArea].displayValue;
    })
  })
}