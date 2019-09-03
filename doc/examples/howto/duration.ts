import ScrollUtility = require("scroll-utility")

ScrollUtility.global.duration = 750 // for all future scroll

// only once
ScrollUtility.global.offset(500, { duration: 750 })
ScrollUtility.global.offset("some-element", 500, { duration: 750 })
ScrollUtility.global.scrollTo(500, { duration: 750 })
ScrollUtility.global.scrollTo("some-element", 500, { duration: 750 })
