import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()
scrollManager.scrollTo("#some-element")
scrollManager.scrollTo(100)
scrollManager.offset(500)
