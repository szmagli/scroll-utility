import ScrollUtility = require("scroll-utility")

// page scroll
new ScrollUtility()
new ScrollUtility({ easing: "easeInOutQuad" }) // same as above

new ScrollUtility({ easing: "linear" }) // linear animation
new ScrollUtility({ easing: (t, b, c, d) => (c * t) / d + b }) // same as above

new ScrollUtility({ easing: "easeOutBounce" }) // bouncy
