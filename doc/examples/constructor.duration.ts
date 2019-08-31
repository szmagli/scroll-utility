import ScrollUtility = require("scroll-utility")

// page scroll
new ScrollUtility() // 1 second, default duration
new ScrollUtility({ duration: 1000 }) // same as above

new ScrollUtility({ duration: 500 }) // 500ms duration
new ScrollUtility({ duration: 0 }) // "instant" scroll
