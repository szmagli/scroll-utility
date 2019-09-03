import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()
scrollManager.offset(window) // scroll by window size
scrollManager.offset(window, 1) // same as above
scrollManager.offset("#some-element") // scroll by some element size
scrollManager.offset("#some-element", 0.5) // scroll by half of some element
scrollManager.offset("#some-element", -1) // scroll up by some element size
