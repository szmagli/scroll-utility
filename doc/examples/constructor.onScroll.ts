import ScrollUtility = require("scroll-utility")

new ScrollUtility() // no action on scroll
new ScrollUtility({ onScroll: null }) // same as above

new ScrollUtility({
  onScroll: external => {
    if (external) {
      console.log("external scroll detected!")
    }
  },
})
