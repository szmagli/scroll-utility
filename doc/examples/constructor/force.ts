import ScrollUtility = require("scroll-utility")

ScrollUtility.global // don't force
new ScrollUtility() // same as above
new ScrollUtility({ force: false }) // same as above
new ScrollUtility({ force: true }) // force
