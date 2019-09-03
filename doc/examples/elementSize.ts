import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()

scrollManager.elementSize(window, 1) // same as scrollManager.size
scrollManager.elementSize(window, 1) // same as above
scrollManager.elementSize(window, 0.5) // same as scrollManager.size / 2
scrollManager.elementSize(window, 0) // 0

scrollManager.elementSize("some-element") // size of some-element
