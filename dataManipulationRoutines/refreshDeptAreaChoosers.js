///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function refreshDeptAreaChoosers()
// Refreshes the departments or areas in the multi-select boxes, and sorts them according to the user's criteria
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshDeptAreaChoosers() {
  var newOption;
  while (liveDisplayChooser.firstChild) {
    liveDisplayChooser.removeChild(liveDisplayChooser.firstChild);
  }
  
  // Return 1 if a comes first, -1 if b comes first, or 0 if they tie
  d3.values(deptsOrAreas).sort(function(a,b) { 
    if (sortStyle == "alphabetical") {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    } else if (sortStyle == "wikiUsage") {
      return displayData[userOptions["serialized"]]["wholeWindow"][b].wikiUsage 
      - displayData[userOptions["serialized"]]["wholeWindow"][a].wikiUsage;
    }
  })
  
  // Populate the multiple-select box
  // innerHTML = the text the user sees
  .forEach(function(item) { 
    newOption = document.createElement("option");
    newOption.value = item;
    newOption.selected = true;
    newOption.innerHTML = item; 
    liveDisplayChooser.appendChild(newOption);
  })
} 