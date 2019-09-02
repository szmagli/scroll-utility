import ScrollUtility = require("scroll-utility")

// page scroll
ScrollUtility.global
new ScrollUtility() // same as above
new ScrollUtility({ container: window }) // same as above
new ScrollUtility({ container: "html" }) // same as above

// scroll inside some element
new ScrollUtility({ container: "#some-element" })
new ScrollUtility({ container: document.querySelector("#some-element") }) // same as above
