import ScrollUtility = require("scroll-utility")

ScrollUtility.global // no action on scroll
new ScrollUtility() // same as above
new ScrollUtility({ onStop: null }) // same as above

new ScrollUtility({
  onStop: () => {
    console.log("scroll ended!")
  },
})
