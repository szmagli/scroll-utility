import ScrollUtility = require("scroll-utility")

function onUserScroll(external: boolean) {
  if (external) {
    console.log("user scrolled!")
  }
}

ScrollUtility.global.onScroll = onUserScroll
