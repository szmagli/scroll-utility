# scroll-utility

[![Travis](https://travis-ci.org/LeDDGroup/scroll-utility.svg?branch=master)](https://travis-ci.org/LeDDGroup/scroll-utility) [![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=QmJOaDZzS3BBOWUrem1PMWw1K29CZjByZjNBcTNyYlE0LzVYZEhFYVg1ST0tLXBOR05wTitscU1PM2FvQ0NrOUlHbHc9PQ==--70960e59e91fc8efc3dced4f2cebeff5665746ca)](https://www.browserstack.com/automate/public-build/QmJOaDZzS3BBOWUrem1PMWw1K29CZjByZjNBcTNyYlE0LzVYZEhFYVg1ST0tLXBOR05wTitscU1PM2FvQ0NrOUlHbHc9PQ==--70960e59e91fc8efc3dced4f2cebeff5665746ca) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/LeddSoftware/scroll-utility) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [Basic usage](#basic-usage)
- [Installation](#installation)
- [Usage](#usage)
  - [Specify scroll container](#specify-scroll-container)
    - [Scroll inside window (default behavior)](#scroll-inside-window-default-behavior)
    - [Scroll a div or any other html element](#scroll-a-div-or-any-other-html-element)
  - [Scroll to specific places in scroll](#scroll-to-specific-places-in-scroll)
    - [Scroll to a position](#scroll-to-a-position)
    - [Scroll to a percent](#scroll-to-a-percent)
    - [Scroll to an element](#scroll-to-an-element)
    - [Offset scroll position](#offset-scroll-position)
    - [options](#options)
    - [examples](#examples)
  - [Stop animations](#stop-animations)
  - [Change animation function](#change-animation-function)
  - [onScroll events](#onscroll-events)
  - [Stack animations and high precision](#stack-animations-and-high-precision)
- [Cross-browser compatibility](#cross-browser-compatibility)
- [Example app with scroll-utility](#example-app-with-scroll-utility)
- [License](#license)
- [Github](#github)

<!-- markdown-toc end -->

# [demo](https://leddgroup.com/scroll-utility)

# Basic usage

```js
import { Scroll } from "scroll-utility"

// declare scroll manager instance

const scrollManager = new Scroll() // create a scroll instance for window for scrolling the page
const elementScrollManager = new Scroll(element) // for scrolling inside element instead of window

// start a scroll animation
scrollManager.scroll.offset(value, options) // offset current scroll position by "value"
scrollManager.scroll.toPosition(position, options) // scroll to position "position"
scrollManager.scroll.toPercent(percent, options) // scroll to position given by "percent"
scrollManager.scroll.toElement(element, options) // scroll to element "element"

// onScroll events
scrollManager.onScroll = () => console.log("scroll occurred in scrollManager container")
scrollManager.onUtilityScroll = () => console.log("this scroll utility did scrolled")
scrollManager.onUserScroll = () => console.log("this scroll utility did not scrolled!")

// stopping animations

scrollManager.stopAllAnimations() // stop all animation in "scrollManager"
const animation = scrollManager.scroll.offset(1000, { duration: 1000 }) // capture animation
animation.stop() // stop animation
```

# Installation

```sh
$ npm install --save scroll-utility
```

or from a cdn at [jsdelivr](https://www.jsdelivr.com/package/npm/scroll-utility)

```html
<script src="https://cdn.jsdelivr.net/npm/scroll-utility"></script>
```

in this case it will be exported globally `ScrollUtility` so you can access it with `window.ScrollUtility`

# Usage

## Specify scroll container

### Scroll inside window (default behavior)

```js
import { Scroll } from "scroll-utility"

const windowScrollManager = new Scroll()
```

`windowScrollManager` will be used to scroll the normal overflow in web pages

### Scroll a div or any other html element

```js
import { Scroll } from "scroll-utility"

const htmlElement = document.getElementById("some-html-element")
const elementScrollManager = new Scroll(htmlElement)
```

`elementScrollManager` will be used to scroll inside that specific element.  
If `htmlElement` is _null_ or _undefined_ it will fallback to window scroll by default and it will create a window scroll instance

## Scroll to specific places in scroll

### Scroll to a position

```js
// assuming windowScrollManager is declared
windowScrollManager.scroll.toPosition(number, options) // number is a position in (px) in scroll

// example:
windowScrollManager.scroll.toPosition(273)
```

### Scroll to a percent

```js
windowScrollManager.scroll.toPercent(percent, options) // number is a percent(from 0 to 100)

// example:
windowScrollManager.scroll.toPercent(0) // scroll to the beginning of the page
windowScrollManager.scroll.toPercent(50) // to the middle
windowScrollManager.scroll.toPercent(100) // the end
```

### Scroll to an element

```js
windowScrollManager.scroll.toElement(htmlElement, options)
```

Here `htmlElement` should be an html element. _null_ or _undefined_ will scroll to the start of its _scrollManger_ container

### Offset scroll position

```js
windowScrollManager.scrollBy(number, options) // will offset scroll position, can be negative
```

### options

```js
const optionsDefault = {
  duration: 0, // duration of the scroll
  horizontal: false, // direction of the scroll animation
  center: 0, // this value is used only for scrollToElement
}
```

### examples

```js
windowScrollManager.scroll.toPercent(50, {
  duration: 1000, // will scroll to the middle of the page vertically
})

windowScrollManager.scroll.toPosition(50, {
  horizontal: true, // will scroll instantly to the middle of the page horizontally in 1 sec
})

windowScrollManager.scroll.toElement(htmlElement, {
  horizontally: true,
  duration: 1500,
  center: 50, // will scroll to the element and center it at 50% in the view (or its container)
})
```

## Stop animations

```js
windowScrollManager.stopAllAnimations() // this will stop all animations in windowScrollManager

// to stop specific animations, you'll have to capture them first:
const animation = windowScrollManager.scroll.toPercent(50, { duration: 1000 })

animation.stop()
```

## Change animation function

```js
windowScrollManager.easing = some_easing_function // will change default easing function for next created animations

// or just for one animation:
windowScrollManager.scroll.toPercent(50, {
  duration: 1000,
}).easing = some_easing_function
```

The [package](https://www.npmjs.com/package/easing-functions) provides easing functions

## onScroll events

```js
const scrollManager = new Scroll(some_element)

scrollManager.onScroll = () => console.log("scroll occurred in scrollManager container")
scrollManager.onUtilityScroll = () => console.log("this scroll utility did scrolled")
scrollManager.onUserScroll = () => console.log("this scroll utility did not scrolled!")
```

for example, if you wish to stop all animations every time the user scroll you could do:

```js
scrollManager.onUserScroll = () => scrollManager.stopAllAnimations()
```

## Stack animations and high precision

The main idea of this module is to be able of doing several animation at the same time, and still get a desirable outcome.  
It is very difficult to archive precision when scrolling, due to the fact that browsers don't scroll well to floating numbers, they often round it up. So is even more difficult when there are several animations.  
That is the best thing of scroll-utility. It is design to work with multiple animations and keep track on where the scroll position should end.

For example:

```js
scrollManager.scroll.offset(500, { duration: 1000 })
scrollManager.scroll.offset(34, { duration: 775 })
```

1 second from it started to move, it will have been offset its position for 534px

```js
scrollManager.scroll.toPosition(0)
scrollManager.scroll.toPercent(50, { duration: 500 })
scrollManager.scroll.toPercent(50, { duration: 1000 })
```

in this example in 1 second to scroll bar will be at the end, due that it created 2 scroll animations that were to scroll 50% of the page (from 0 to 50), so 50% + 50% = 100%

So generally when you use _toPercent_ _toPosition_ _toElement_, you would want to use _stopAllAnimation_, to ensure that there are not any other animation, otherwise they will stack together, which is generally not wanted

# Cross-browser compatibility

Compatibility guaranteed in Firefox, Chrome, Edge, Safari. In Opera and IE should work too, but there are no tests yet.

<img  height="50" src="https://raw.githubusercontent.com/LeDDGroup/scroll-utility/master/assets/BrowserStack-logo.png" alt="Browserstack logo" style="float: right; margin-right: 10px; text-align: middle">

Test are made using automate testing with [Browserstack](https://www.browserstack.com) [for open source](https://www.browserstack.com/open-source?ref=pricing).

See tests results [here](https://www.browserstack.com/automate/public-build/QmJOaDZzS3BBOWUrem1PMWw1K29CZjByZjNBcTNyYlE0LzVYZEhFYVg1ST0tLXBOR05wTitscU1PM2FvQ0NrOUlHbHc9PQ==--70960e59e91fc8efc3dced4f2cebeff5665746ca)

# Example app with scroll-utility

To see a example with react, clone the [demo](https://github.com/LeDDGroup/scroll-utility-demo)(see demo [here](https://leddgroup.com/scroll-example))

```sh
git clone https://github.com/LeDDGroup/scroll-utility-demo
cd scroll-utility-demo
npm install
npm start
```

Navigate to http://localhost:8080

# License

[MIT](./LICENSE.md)

# Github

If you have any question, issue, suggestion, idea, etc..., just reach out:  
<david@leddgroup.com>  
[linkedin profile](https://www.linkedin.com/in/david-perez-alvarez-291862132)  
post an [issue](https://github.com/LeDDGroup/scroll-utility/issues)  
say something in [gitter](https://gitter.im/LeddSoftware/scroll-utility)

This was made in my free time, and I most appreciate any feedback. If you think it's helpful just leave a star in [github](https://github.com/LeDDGroup/scroll-utility/)
