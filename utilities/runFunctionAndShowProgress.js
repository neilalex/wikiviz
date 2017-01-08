///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function runFunctionAndShowProgress(functionToRun)
// Displays a "please wait" notification while simultaneously running the function passed in as an argument
// 
// How it works:
// JavaScript does not provide a direct way to create threads, so we use "setInterval"
// to launch a block of code once every 25 milliseconds, where each launch will occur incidentally in its own separate thread
//
// The first time this block is run, we have it place a "please wait while loading" message on the screen
// The second time the block is run, it runs "functionToRun"
// The third and beyond times it does nothing
//
// If runFunctionAndShowProgress is called multiple times before a given "functionToRun" has completed (which
// is possible, since functionToRun is launched in its own thread), a queue of 
// "funnctionToRun" functions is established
//
// After all functions in the queue have run, the "please wait" note is removed
// and "clearInterval" is called to stop setInterval from continuing to fire
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var semaphore = 0;
var nextQueuePosition = 1;
var runQueue = 1;
function runFunctionAndShowProgress(functionToRun) {
  var loading = false;
  var orderInQueue;
  
  // Begin firing a wrapper function every 25 milliseconds
  var processor = setInterval(function() {
    
    // Add progress indicator and increase size of queue
    if (!loading) {
      loading = true;
      
      // Use a pseudo "semaphore" to track whether any queued functions have not yet run
      semaphore++;
      
      // Increase size of queue
      orderInQueue = nextQueuePosition;
      nextQueuePosition++;
      
      // Show the progress indicator
      d3.select("#subvisHelperText").html("");
      d3.select("#visText").html("&nbsp;");
      d3.select("#progressNote").html("Please wait while loading...");
      
    // If progress indicator already created, begin executing the function
    } else if(orderInQueue == runQueue) {
      
      // Run the function
      functionToRun();
      
      // Stop firing the wrapper function (that we're currently in) now that the key function has finished
      clearInterval(processor);
      
      // If *all* queued functions have finished, remove the progress indicator
      semaphore--;      
      if (semaphore == 0) {
        d3.select("#progressNote").html("&nbsp;");
      }
      
      // Move on to the next function in the queue
      runQueue++;
      
    }
  }, 25);
}