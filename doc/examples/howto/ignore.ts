import ScrollUtility = require("scroll-utility")

ScrollUtility.global.force = true // for all future scroll

// only once
ScrollUtility.global.offset(500, { force: true })
ScrollUtility.global.offset("some-element", 500, { force: true })
ScrollUtility.global.scrollTo(500, { force: true })
ScrollUtility.global.scrollTo("some-element", 500, { force: true })
