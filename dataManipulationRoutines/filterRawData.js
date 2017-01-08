///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function filterRawData()
// Creates a data structure that captures the time horizon of interest from the raw CSV data
// Also creates lists of the unique sets of departments, areas, weeks, months, and years in this filtered data
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function filterRawData() {
  
  // Dates the user selected
  startDate = d3.time.format("%m-%d-%Y").parse(d3.select("#beginDateChooser").property("value"))
  endDate = d3.time.format("%m-%d-%Y").parse(d3.select("#endDateChooser").property("value"))  
  
  // Store data from the time horizon of interest
  var dataDate;
  filteredRawData = data.filter(function(d) {
    dataDate = d3.time.format("%x").parse(d.week);
    return (dataDate >= startDate && dataDate <= endDate);
  });
  
  // Create department, area, and time window lists
  departments = [], areas = [], weeks = [], months = [], years = [];  
  filteredRawData.forEach(function(d) {
    var deptName = userFriendlyDataValue(d.department);
    if (!departments.hasOwnProperty(deptName)) departments[deptName] = deptName;
    
    var areaName = userFriendlyDataValue(d.area);
    if (!areas.hasOwnProperty(areaName)) areas[areaName] = areaName;
    
    // Week must be in MM/DD/YYYY format
    var week = d3.time.format("%x").parse(d.week); 
    if (!weeks.hasOwnProperty(week)) weeks[week] = week;
    
    // Month must be in YYYY-MM format
    var month = d3.time.format("%Y-%m").parse(d.month); 
    if (!months.hasOwnProperty(month)) months[month] = month;
    
    var year = new Date(d3.time.format("%Y-%m").parse(d.month).getFullYear(),0,1);
    if (!years.hasOwnProperty(year)) years[year] = year;    
  })
  
  // Clear any previously-loaded display data (and rely on future lazy-loading to grab it again)
  displayData = [];
}  