import ScrollUtility = require("scroll-utility")

ScrollUtility.global.easing = "linear" // for all future scroll

// only once
ScrollUtility.global.offset(500, { easing: "linear" })
ScrollUtility.global.offset("some-element", 500, { easing: "linear" })
ScrollUtility.global.scrollTo(500, { easing: "linear" })
ScrollUtility.global.scrollTo("some-element", 500, { easing: "linear" })
