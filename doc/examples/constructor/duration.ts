import ScrollUtility = require("scroll-utility")

// page scroll
ScrollUtility.global // 1 second, default duration
new ScrollUtility() // same as above
new ScrollUtility({ duration: 1000 }) // same as above

new ScrollUtility({ duration: 500 }) // 500ms duration
new ScrollUtility({ duration: 0 }) // "instant" scroll
