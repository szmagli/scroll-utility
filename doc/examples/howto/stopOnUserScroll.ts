import ScrollUtility = require("scroll-utility")

function stop(external: boolean) {
  if (external) {
    ScrollUtility.global.stop()
  }
}

ScrollUtility.global.onScroll = stop
