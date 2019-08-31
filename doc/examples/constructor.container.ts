import ScrollUtility = require("scroll-utility")

// page scroll
ScrollUtility
ScrollUtility.new()
ScrollUtility.new({ container: window }) // same as above
ScrollUtility.new({ container: "html" }) // same as above

// scroll inside some element
ScrollUtility.new({ container: "#some-element" })
ScrollUtility.new({ container: document.querySelector("#some-element") }) // same as above
