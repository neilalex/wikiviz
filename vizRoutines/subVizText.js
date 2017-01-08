///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function subVisText()
// Displays relevant on-screen stats next to the pie charts
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function subVisText() {
  
  // Assemble text to display next to pie charts
  if (userOptions["timeUnit"] == "weekly") {
    windowPrefix = " Week of<br>";
    windowSuffix = "";
  } else {
    windowPrefix = "";
    windowSuffix = "<br>";
  }
  
  // Text on top of subvis 1
  d3.select("#subvis1textTop").html("<center><b>" + displayTypeText  + ":</b> " + subvisDeptOrArea 
    + "<br><b>Time Window:</b> " + d3.select("#beginDateChooser").property("value") 
    + " to<br>" + d3.select("#endDateChooser").property("value") + " (full window)</center>"); 
    
  // Text below subvis 1
  d3.select("#subvis1textBottom").html("<center><b>Number of events meeting<br>selected criteria:</b> " 
    + d3.format(null)(pie1DataSum) + "</center>");
  
  // Text on top of subvis 2
  d3.select("#subvis2textTop").html("<center><b>" + displayTypeText  + ":</b> " + subvisDeptOrArea 
    + "<br><b>Time Window:</b> " + windowPrefix + d3.time.format(xTickFormat)(subvisTimeUnit) 
    + " (selected)</center>" + windowSuffix); 
    
  // Text below subvis 2
  d3.select("#subvis2textBottom").html("<center><b>Number of events meeting<br>selected criteria:</b> " 
    + d3.format(null)(pie2DataSum) + "</center>");
  
  // Helper text at the bottom of the graphic, which actually refers to the main visualization below this one
  d3.select("#subvisHelperText").html("<i><font color=\"red\">Hover mouse over pie charts to display " 
    + subDisplayTypeTextText + " subdivisions</font></i>");

}