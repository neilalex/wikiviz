///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function catalogUserOptions()
// Reads all user options and loads them into a hashtable for quick access
// Also generates a few variables for indexing the user's filter/selection choices
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function catalogUserOptions() {
  userOptions["breakdown"] = document.breakdown.bars.value;
  userOptions["timeUnit"] = document.timeBlocks.tab.value;
  userOptions["chartType"] = document.chartType.relativeAbsolute.value;
  userOptions["Activity-C"] = activityOptions[0].checked*1;
  userOptions["Activity-U"] = activityOptions[1].checked*1;
  userOptions["Activity-R"] = activityOptions[2].checked*1;
  userOptions["Activity-D"] = activityOptions[3].checked*1;
  userOptions["ContentType-P"] = contentTypeOptions[0].checked*1;
  userOptions["ContentType-C"] = contentTypeOptions[1].checked*1;
  userOptions["ContentType-A"] = contentTypeOptions[2].checked*1;
  
  // In some instances we will need to refer to the combination of user choices all together
  // Create a unique string that identifies these choices
  userOptions["serialized"] = userOptions["breakdown"] + "-" + userOptions["timeUnit"] + "-" + userOptions["Activity-C"] + "-" 
                           + userOptions["Activity-U"] + "-" + userOptions["Activity-R"] + "-" + userOptions["Activity-D"] + "-" 
                           + userOptions["ContentType-P"] + "-" + userOptions["ContentType-C"] + "-" + userOptions["ContentType-A"];
  
  // There are two multi-select boxes: one for departments, and one for areas. Based on the user's selection, 
  // show one and hide the other. Also, update the color domain, some on-screen text, and a few other 
  // variables depending on whether the user chose to view departments or areas
  if (userOptions["breakdown"] == "departments") {
    mainVisColors.domain(d3.keys(departments));
    liveDisplayChooser = document.deptAreaFilter.departments;
    d3.select(".chooserInstruction").style("display", "");
    document.deptAreaFilter.areas.style.display = "none"
    document.deptAreaFilter.departments.style.display = ""
    document.getElementById("deptAreaLabel").innerHTML = "<b>Choose departments:</b>"
    displayTypeText = "Department";
    subDisplayTypeTextText = "area"
    deptsOrAreas = departments; //So we can generically refer to depts/areas
    subDeptsOrAreas = areas;   
     
  } else if (userOptions["breakdown"] == "areas") {       
    mainVisColors.domain(d3.keys(areas));
    liveDisplayChooser = document.deptAreaFilter.areas;
    document.deptAreaFilter.areas.style.display = ""
    document.deptAreaFilter.departments.style.display = "none"
    document.getElementById("deptAreaLabel").innerHTML = "<b>Choose areas:</b>"
    displayTypeText = "Area";
    subDisplayTypeTextText = "department";
    deptsOrAreas = areas;  //So we can generically refer to depts/areas
    subDeptsOrAreas = departments;    
  }
  
  // Generically refer to the list of time units in the main visualization (whether weeks, months, or years)
  switch(userOptions["timeUnit"]) {
    case "weekly":  
      timeUnits = weeks;
      parseFormat = "%m-%d-%Y";
      break;
    case "monthly":
      timeUnits = months;
      parseFormat = "%m-%Y";
      break;
    case "yearly":
      timeUnits = years;
      parseFormat = "%Y";
      break;
  }
  
  // Lazy-load the display data for the new user options if not already loaded
  if (!displayData.hasOwnProperty(userOptions["serialized"])) {
    lazyLoadDisplayData();
  }
  
}