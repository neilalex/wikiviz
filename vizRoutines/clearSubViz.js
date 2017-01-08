///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function clearSubViz()
// Erases pie charts and sub-visualization text from the screen
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearSubViz() {
  
  subVisOnScreen = false;
    
  d3.select("#visText").html("&nbsp;");
  
  // Remove pie charts
  subCanvas1.selectAll(".arc").remove();
  subCanvas2.selectAll(".arc").remove();
  
  // Remove the "this is the area / deparment you have selected" rectangles from the main viz
  canvas.selectAll(".selectedRect").remove();
  
  // Clear text from sub-visualization
  d3.select("#subvis1textTop").html("");
  d3.select("#subvis2textTop").html("");
  d3.select("#subvis1textBottom").html("");
  d3.select("#subvis2textBottom").html("");
  d3.select("#subvisHelperText").html("");
}