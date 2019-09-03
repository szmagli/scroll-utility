import ScrollUtility = require("scroll-utility")

function onScroll() {
  console.log("scrolled")
}

ScrollUtility.global.onScroll = onScroll
