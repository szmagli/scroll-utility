import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()
scrollManager.scrollTo("#some-element") // scroll to element
scrollManager.scrollTo("#some-element", 0) // same as above
scrollManager.scrollTo("#some-element", 0.5) // scroll to element and center it
scrollManager.scrollTo("#some-element", 1) // scroll to element and place at bottom
