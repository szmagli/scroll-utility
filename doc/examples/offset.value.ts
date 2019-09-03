import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()
scrollManager.offset(-500) // 500px up
scrollManager.offset(0) // dont scroll
scrollManager.offset(500) // scroll 500px down
