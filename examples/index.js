const ErrorTracker = require("../lib/cjs");
// Create a new instance of ErrorTracker
const tracker = new ErrorTracker();

console.error("This is an error message");

function myFunction() {
  throw new Error("Something went wrong");
}

myFunction();

try {
  myFunction();
} catch (error) {
  // This will trigger the 'error' event listener and report the error to the server
  console.error("error caught here");
}
