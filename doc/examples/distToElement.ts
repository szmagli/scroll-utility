import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()
console.log(scrollManager.distToElement("#some-element", 0)) // dist to scroll to element
console.log(scrollManager.distToElement("#some-element", 0.5)) // dist to scroll to center element element
