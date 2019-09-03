import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()
scrollManager.scrollTo(0) // scroll top
scrollManager.scrollTo(500) // scroll to a specific position (px)
scrollManager.scrollTo(Infinity) // scroll bottom
