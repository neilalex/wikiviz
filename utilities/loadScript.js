///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function loadScript(path)
// Dynamically adds a Javascript file to the DOM
// See http://stackoverflow.com/questions/690781/debugging-scripts-added-via-jquery-getscript-function
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var loadScript = function (path) {
  var result = $.Deferred(),
  script = document.createElement("script");
  script.async = "async";
  script.type = "text/javascript";
  script.src = path;
  script.onload = script.onreadystatechange = function (_, isAbort) {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
         if (isAbort)
             result.reject();
         else
            result.resolve();
    }
  };
  script.onerror = function () { result.reject(); };
  $("head")[0].appendChild(script);
  return result.promise();
};