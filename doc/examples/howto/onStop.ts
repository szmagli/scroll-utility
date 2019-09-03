import ScrollUtility = require("scroll-utility")

function onStop() {
  console.log("scroll animations ended")
}

ScrollUtility.global.onStop = onStop
