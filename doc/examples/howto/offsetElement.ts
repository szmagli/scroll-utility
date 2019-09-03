import ScrollUtility = require("scroll-utility")

ScrollUtility.global.offset(window) // scroll a screen down
ScrollUtility.global.offset(window, 0.5) // scroll half a screen down
ScrollUtility.global.offset(window, -0.5) // scroll half a screen up
ScrollUtility.global.offset(window, -1) // scroll a screen up
