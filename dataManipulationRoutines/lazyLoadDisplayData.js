///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function lazyLoadDisplayData()
// Filters and tabulates data according to the user's selected options
// Saves to a hashtable for faster access the next time the user selects these same options
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function lazyLoadDisplayData() {
  
  // Tally events across the whole selected time window, in addition to individually by time block
  displayData[userOptions["serialized"]] = [];
  displayData[userOptions["serialized"]]["wholeWindow"] = []; 
  var timeUnit, deptOrArea, subDeptOrArea;

  // Initialize variables for each timeUnit-deptOrArea combination to zero
  // Do the same for the subdivision data inside each
  // 'timeUnits' is the unique set of weeks, months, or years (depending on user choice) identified during the user option cataloging
  // 'deptsOrAreas' is the unique set identified during the user option catalog
  d3.values(timeUnits).forEach(function(timeUnit) { 
    displayData[userOptions["serialized"]][timeUnit] = [];
    d3.values(deptsOrAreas).forEach(function(deptOrArea) { 
      displayData[userOptions["serialized"]][timeUnit][deptOrArea] = { 
        timeUnit: timeUnit,
        wikiUsage: 0,
        
        // Keep track of the prior rectangle in the chart that this rectangle stacks on top of
        priorDisplayValue: 0, 
        
        // Keep track of the area subdivision if this is an department, or the department subdivision if this is a area
        subDisplayData: [] 
      }
      d3.values(subDeptsOrAreas).forEach(function(subDeptOrArea) { //Initialize values for the subDisplayData
        displayData[userOptions["serialized"]][timeUnit][deptOrArea].subDisplayData[subDeptOrArea] = {
          deptOrArea: deptOrArea,
          timeUnit: timeUnit,
          wikiUsage: 0
        }
      });
    });
  });

  // Do the same thing over again, but this for the whole time window all together
  d3.values(deptsOrAreas).forEach(function(deptOrArea) {
    displayData[userOptions["serialized"]]["wholeWindow"][deptOrArea] = {
      timeUnit: "wholeWindow",
      wikiUsage: 0,
      priorDisplayValue: 0,
      subDisplayData: []
    }
    d3.values(subDeptsOrAreas).forEach(function(subDeptOrArea) {
      displayData[userOptions["serialized"]]["wholeWindow"][deptOrArea].subDisplayData[subDeptOrArea] = {
        deptOrArea: deptOrArea,
        timeUnit: "wholeWindow",
        wikiUsage: 0
      }
    });
  });

  // Loop through the raw filtered data and add the event counts meeting the user's criteria to the variables we just initialized
  // Assumes d.action will be either "C", "U", "R", or "D" and d.contentType will be either "P", "C", or "A"
  // Week in raw data must be in MM/DD/YYYY format
  // Month in raw data must be in YYYY-MM format
  filteredRawData.forEach(function(d) {
    if (userOptions["Activity-" + d.action] == 1 && userOptions["ContentType-" + d.contentType] == 1) { 
      
      // Time units
      switch(userOptions["timeUnit"]) {
        case "weekly":
          timeUnit = d3.time.format("%x").parse(d.week);   
          break;
        case "monthly":
          timeUnit = d3.time.format("%Y-%m").parse(d.month); 
          break;
        case "yearly":
          timeUnit = new Date(d3.time.format("%Y-%m").parse(d.month).getFullYear(),0,1);
          break;
      }      
      
      // Departments vs. areas
      if (userOptions["breakdown"] == "departments") {
        deptOrArea = userFriendlyDataValue(d.department);
        subDeptOrArea = userFriendlyDataValue(d.area);
      } else if (userOptions["breakdown"] == "areas") {
        deptOrArea = userFriendlyDataValue(d.area);
        subDeptOrArea = userFriendlyDataValue(d.department);
      }
      
      // Add the event count from the current raw data record
      // Have to multiply by 1 because sometimes javaScript reads the CSV event count as a string.
      displayData[userOptions["serialized"]][timeUnit][deptOrArea].wikiUsage += d.count*1;  
      displayData[userOptions["serialized"]]["wholeWindow"][deptOrArea].wikiUsage += d.count*1;             
      displayData[userOptions["serialized"]][timeUnit][deptOrArea].subDisplayData[subDeptOrArea].wikiUsage += d.count*1;
      displayData[userOptions["serialized"]]["wholeWindow"][deptOrArea].subDisplayData[subDeptOrArea].wikiUsage += d.count*1;
      
    }       
  });
}