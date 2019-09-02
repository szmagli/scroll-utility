import ScrollUtility = require("scroll-utility")

new ScrollUtility() // no action on scroll end
new ScrollUtility({ onStop: null }) // same as above

new ScrollUtility({
  onStop: () => {
    console.log("scroll ended!")
  },
})
