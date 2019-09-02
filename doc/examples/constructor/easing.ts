import ScrollUtility = require("scroll-utility")

// page scroll
ScrollUtility.global
new ScrollUtility() // same as above
new ScrollUtility({ easing: "easeInOutQuad" }) // same as above

new ScrollUtility({ easing: "linear" }) // linear animation
new ScrollUtility({ easing: (t, b, c, d) => (c * t) / d + b }) // same as above

new ScrollUtility({ easing: "easeOutBounce" }) // bouncy
