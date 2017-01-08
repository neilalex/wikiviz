///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Wiki User Activity Log Analyzer
// Main Visualization Routine
// 
// Steps include:
// - Initialize a set of global variables, including for base data structures and SVG components
// - Create the visualization's non-data elements (axes, chart titles, etc.)
// - Construct an initial set of data-driven visuals, first by preparing the data, and then binding this data to graphics
// - Establish user event handlers
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initialize global variables
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Raw data file name
var dataFileName = "data/wikiactivity.csv"

// Default dates correspond to the sample data we will eventually load          
var defaultStartDate = new Date(2013,05,01);
var defaultEndDate = new Date(2014,04,31);

// Set up date chooser controls
// Assume date format of mm-dd-yy
$(function() {
  $("#beginDateChooser").datepicker({showAnim: ""});
  $("#beginDateChooser").datepicker("setDate", defaultStartDate);
  $("#beginDateChooser").datepicker("option", "dateFormat", "mm-dd-yy"); 
  $("#endDateChooser").datepicker({showAnim: ""});
  $("#endDateChooser").datepicker("setDate", defaultEndDate);
  $("#endDateChooser").datepicker("option", "dateFormat", "mm-dd-yy");
});

// Data structures -- populated below when loading and manipulating data
var departments = [], areas = [], weeks = [], months = [], years = [], deptsOrAreas, subDeptsOrAreas, timeUnits, parseFormat;
var data = [], filteredRawData = [], displayData, startDate, endDate, liveDisplayChooser, userOptions = [], maxUsageOverAllTimeWindows;    

// Base SVG components
var mainVisMargin = {
    top: 25,
    right: 60,
    bottom: 100,
    left: 60
};    
bbMainVis = {
  x: mainVisMargin.left,
  y: mainVisMargin.top,
  w: 960 - mainVisMargin.left - mainVisMargin.right,
  h: 570 - mainVisMargin.top - mainVisMargin.bottom
};
var subVisMargin = {
    top: 40,
    right: 30,
    bottom: 40,
    left: 30
};
bbSubVis = {
  x: subVisMargin.left,
  y: subVisMargin.top,
  w: 250,
  h: 120
};

// Variables for base data structers and other parameters
// Regarding colors, the main visualization cycles through seven of them
// The pie charts use one of the colorbrewer color schemes (loaded via library)
var mainVisColors = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); 
var pieColors = d3.scale.ordinal().domain([1,12]).range(colorbrewer.Set3[12]); 
var pie1Layout, pieArc, pie1Group, pie1DataSum, pie2Layout, pieArc, pie2Group, pie2DataSum, subVisOnScreen = false;
var subvis1data, subvis2data, subvisDeptOrArea, subvisTimeUnit, selectBoxData, selectBoxDeptOrArea, selectBoxTimeUnit;
var displayTypeText, subDisplayTypeTextText;
var timeWindows, displayBars;

//The area/department multiple select boxes sort alphabetically by default
var sortStyle = "alphabetical"; 
  
  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create SVG components
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
// Main visualization canvas for the stacked bars
canvas = d3.select("#vis").append("svg").attr({
  width: bbMainVis.w + mainVisMargin.left + mainVisMargin.right,
  height: bbMainVis.h + mainVisMargin.top + mainVisMargin.bottom
}).append("g").attr({
  transform: "translate(" + mainVisMargin.left + "," + mainVisMargin.top + ")"
});

// Subvisualization canvases for the drill-down pie charts
subCanvas1 = d3.select("#subvis1").append("svg").attr({
  width: bbSubVis.w,
  height: bbSubVis.h,
  align: "bottom"
}).append("g");     
subCanvas2 = d3.select("#subvis2").append("svg").attr({
  width: bbSubVis.w,
  height: bbSubVis.h,
  align: "bottom"
}).append("g");

// Main visualization axes and chart title
var yTickFormat, yDomain, yAxisLabelText, yAxisLabelOffset, xTickFormat, chartTitleText = ""; 
var xScaleO = d3.scale.ordinal().rangeRoundBands([0, bbMainVis.w], .1);
var xAxisO = d3.svg.axis().scale(xScaleO).orient("bottom");
var yScaleO = d3.scale.linear().rangeRound([bbMainVis.h, 0]);
var yAxisO = d3.svg.axis().scale(yScaleO).orient("left");
var xAxis = canvas.append("g")
  .attr("class", "x axis")
  .attr("font-family", "sans-serif")
  .attr("font-size", "10.5px")
  .attr("transform", "translate(" + String(bbMainVis.x) + "," + String(bbMainVis.y + bbMainVis.h) + ")");
var yAxis = canvas.append("g")
  .attr("class", "y axis")
  .attr("font-family", "sans-serif")
  .attr("font-size", "12px")
  .attr("transform", "translate(" + String(bbMainVis.x) + "," + String(bbMainVis.y) + ")");
var yAxisLabel = yAxis.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)");  
var chartTitle = yAxis.append("text")
  .attr("x", 50)
  .attr("y", -25)
  .style("font-size", "14px")
  .style("font-weight", "bold")

// Tooltip DOM element
var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background-color", "white")
  .style("border", "3px solid gray")
  .style("font-family", "Arial, Helvetica, sans-serif");  


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Construct initial visuals
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the relevant data manipulation and visualization routines
$.when(
  loadScript("utilities/userFriendlyDataValue.js"),
  loadScript("utilities/pieArcTween.js"),
  loadScript("utilities/runFunctionAndShowProgress.js"),
    
  loadScript("dataManipulationRoutines/filterRawData.js"),
  loadScript("dataManipulationRoutines/lazyLoadDisplayData.js"),
  loadScript("dataManipulationRoutines/catalogUserOptions.js"),
  loadScript("dataManipulationRoutines/refreshDeptAreaChoosers.js"),

  loadScript("vizRoutines/calcRectSizesAndPositions.js"),
  loadScript("vizRoutines/updateXAxis.js"),
  loadScript("vizRoutines/updateYAxis.js"),
  loadScript("vizRoutines/drawMainViz.js"),
  loadScript("vizRoutines/transitionMainViz.js"),
  loadScript("vizRoutines/drawSubViz.js"),
  loadScript("vizRoutines/transitionSubViz.js"),
  loadScript("vizRoutines/subVizText.js"),
  loadScript("vizRoutines/clearSubViz.js"),
  loadScript("vizRoutines/updateChartTitle.js"),
  
  $.Deferred(function(deferred) { $(deferred.resolve); })
  
).done(function() {

// Load the raw data
d3.csv(dataFileName, function(csvData) {  
data = csvData;
  
// Populate an initial visualization using the user control defaults
runFunctionAndShowProgress(function(){
  filterRawData();
  catalogUserOptions();
  refreshDeptAreaChoosers();
  calcRectSizesAndPositions();
  updateXAxis();
  updateYAxis();
  drawMainViz();
  updateChartTitle();
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Establish event handlers
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// User re-filters on departments or areas 
d3.selectAll(".promptsRefilter").on("click", function(){runFunctionAndShowProgress(function() {
  filterRawData();
  catalogUserOptions();
  refreshDeptAreaChoosers();
  calcRectSizesAndPositions();
  updateXAxis();
  updateYAxis();
  drawMainViz();
  updateChartTitle();
});});

// User changes an option that requires a full visualization re-draw
d3.selectAll(".promptsFullUpdate").on("click", function(){runFunctionAndShowProgress(function() {
  catalogUserOptions();
  calcRectSizesAndPositions();
  updateXAxis();
  updateYAxis();
  drawMainViz();
  updateChartTitle();
});});

// User changes an option that requires only visualization transitions
d3.selectAll(".promptsTransition").on("click", function(){runFunctionAndShowProgress(function(){
  catalogUserOptions();
  calcRectSizesAndPositions();
  updateYAxis();
  transitionMainViz();  
  updateChartTitle();
});});

// User cahnges the department / area breakdown
d3.selectAll(".changesBreakdown").on("click", function(){runFunctionAndShowProgress(function() {
  catalogUserOptions();
  refreshDeptAreaChoosers();
  calcRectSizesAndPositions();
  updateYAxis();
  drawMainViz();
  updateChartTitle();
});});

// User sorts departments / areas alphabetically
d3.selectAll(".changesDeptAreaSortAlpha").on("click", function(){runFunctionAndShowProgress(function() {
  //Need to transition the whole main vis, because sorting the chooser could have changed the selection
  sortStyle = "alphabetical";
  catalogUserOptions();
  refreshDeptAreaChoosers();
  calcRectSizesAndPositions();
  updateYAxis();
  transitionMainViz();
  updateChartTitle();
});});

// User sorts departments / areas according to number of events
d3.selectAll(".changesDeptAreaSortEvents").on("click", function(){runFunctionAndShowProgress(function() {
  //Need to transition the whole main vis, because sorting the chooser could have changed the selection
  sortStyle = "wikiUsage";
  catalogUserOptions();
  refreshDeptAreaChoosers();
  calcRectSizesAndPositions();
  updateYAxis();
  transitionMainViz();
  updateChartTitle();
});});

// User chooses new departments or areas to display
d3.selectAll(".changesDeptAreaChoices").on("change", function(){runFunctionAndShowProgress(function(){
  calcRectSizesAndPositions();
  updateYAxis();
  transitionMainViz();  
  updateChartTitle();
});});
  
});  
});