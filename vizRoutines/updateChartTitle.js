///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function updateChartTitle()
// Updates the title on the top of the main stacked bar chart
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateChartTitle() {
  chartTitleText = "";

  // Time unit
  switch (userOptions["timeUnit"]) {
    case "weekly":
      chartTitleText += "Weekly";  
      break;
    case "monthly":
      chartTitleText += "Monthly";
      break;
    case "yearly":
      chartTitleText += "Yearly";
      break;
  }
        
  chartTitleText += " ";

  // Activity types
  var activityTypes = [];
  if (activityOptions[0].checked) activityTypes[activityTypes.length] = "Create";
  if (activityOptions[1].checked) activityTypes[activityTypes.length] = "Update";
  if (activityOptions[2].checked) activityTypes[activityTypes.length] = "Read";
  if (activityOptions[3].checked) activityTypes[activityTypes.length] = "Delete";
  activityTypes.forEach(function(d, i) {
    if (i == 0) {
      chartTitleText += activityTypes[i];
    } else if (i == activityTypes.length - 1 && i != 1) {
      chartTitleText += (", and " + activityTypes[i]);
    } else if (i == activityTypes.length - 1) {
      chartTitleText += (" and " + activityTypes[i]);
    } else {
      chartTitleText += ", " + activityTypes[i];
    }
  })
  
  chartTitleText += " Events for ";
  
  // Departments or areas
  if (userOptions["breakdown"] == "departments") {    
    chartTitleText += "Department";
  } else if (userOptions["breakdown"] == "areas") {   
    chartTitleText += "Area";
  }
  
  chartTitleText += " ";
          
  // Pages, comments, and/or attachments
  var contentTypes = [];
  if (contentTypeOptions[0].checked) contentTypes[contentTypes.length] = "Pages";
  if (contentTypeOptions[1].checked) contentTypes[contentTypes.length] = "Comments";
  if (contentTypeOptions[2].checked) contentTypes[contentTypes.length] = "Attachments";
  contentTypes.forEach(function(d, i) {
    if (i == 0) {
      chartTitleText += contentTypes[i];
    } else if (i == contentTypes.length - 1 && i != 1) {
      chartTitleText += (", and " + contentTypes[i]);
    } else if (i == contentTypes.length - 1) {
      chartTitleText += (" and " + contentTypes[i]);
    } else {
      chartTitleText += ", " + contentTypes[i];
    }
  })
  
  if (activityTypes.length == 0 || contentTypes.length == 0) {
    chartTitleText = "";
  }
  
  chartTitle.text(chartTitleText);
  d3.select("#visText").html("Hover mouse over bars to display " + displayTypeText.toLowerCase() + " quantities");
}