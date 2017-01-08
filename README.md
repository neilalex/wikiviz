# wikiviz

Interactive visualization of user activity log data from a wiki site. To view a live/working version, see [http://www.neilalex.com/interactive-visualization-using-d3-js/](http://www.neilalex.com/interactive-visualization-using-d3-js/). 
&nbsp;  
#### Aspects

* Loads a CSV of web log data; code can be modified to connect to a database
* Lazy filters and aggregates data to create views according to the user's chosen options
  * Stores tabulated data in a hash table for faster access if the user returns to a given combination of options
* Uses a JavaScript browser "hack" to launch a progress indicator in its own thread
  * Code for this is in utilities/runFunctionAndShowProgress.js
* Uses D3.js transitions to guide exploratory data analysis and storytelling
  &nbsp;  
#### Operation

Serve wikiviz.html to launch the visualization.

(Doing so will load wikiviz.js, which subsequently loads several JavaScript helper modules as well as the data at data/wikiactivity.csv.)
&nbsp;  
&nbsp;  
&nbsp;  
Please contact [neil@neilalex.com](mailto:neil@neilalex.com) with questions or comments.
