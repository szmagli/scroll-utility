import ScrollUtility = require("scroll-utility")

ScrollUtility.global // no action on scroll
new ScrollUtility() // same as above
new ScrollUtility({ onScroll: null }) // same as above

new ScrollUtility({
  onScroll: external => {
    if (external) {
      console.log("external scroll detected!")
    }
  },
})
