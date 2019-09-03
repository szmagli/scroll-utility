import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()

const options: {
  duration?: number
  easing?: (() => number) | string
  force?: boolean
} = {}

scrollManager.offset(500, options) // scroll by some position
scrollManager.offset("#some-element", 1, options) // scroll by some element size
