# [scroll-utiliy](https://github.com/LeDDGroup/scroll-utility)

[![Travis](https://travis-ci.org/LeDDGroup/scroll-utility.svg?branch=master)](https://github.com/LeDDGroup/scroll-utility)

A simple scroll utility for scrolling the page, inside an element, centering elements, and smooth scroll animations.

## Installation

```console
$ npm install --save scroll-utility 
```

## Usage

### Scroll inside window
```js
const Scroll = require("scroll-utility");
// or from typescript
// import Scroll from "scroll-utility";

const scrollManger = new Scroll();
scrollManger.scrollTo(props);
```

### Scroll inside element
Alternatively you can define the object in wich the scroll will take place:
```js
const scrollable = document.getElementById("scrollable");

const scrollManger = new Scroll(scrollable);
scrollManger.scrollTo(props);
```

### Props
```
scrollManager.scrollTo({
  offset?: number;
  duration?: number;
  element?: HTMLElement;
  percent?: number;
  cb?: () => void;
  direction?: "vertical" | "horizontal" | "both";
});
```

`offset`: will offset the final position certain amount.

`duration`: (in ms) will be the duration of the scroll.

`element`: if specify will scroll to the element.

`percent`: 
- will set the scroll in a percent relative to its height.
- if an `element` is specified it will scroll to the element an position it in a percent relative to the window.

`cb`: a callback after the scroll ends. Generally used with a `duration`.

`direction` is the direction of the scroll action. Vertically or(and) horizontally. Default vertical.

If no `duration` then it will be like 0.

If no `offset` then it will be like 0.

If no `percent` it will not be like 0, just will not affect scroll.

If no `element` it will not affect scroll.

## Github

If have any issue or feature request notify me via [github](https://github.com/LeDDGroup/scroll-utility/issues).
